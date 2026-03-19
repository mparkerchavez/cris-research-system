#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PUBLIC_DIR="$ROOT_DIR/public"

perl -0777 -e '
use strict;
use warnings;

my $public = $ARGV[0];
my @css_files = sort glob("$public/styles/*.css");
my $html_file = "$public/index.html";
my $js_file = "$public/app.js";

my (%css_classes, %selector_count, %selector_files);

for my $file (@css_files) {
  open my $fh, "<", $file or die "Cannot read $file: $!";
  local $/;
  my $css = <$fh>;
  $css =~ s!/\*.*?\*/!!gs;

  while ($css =~ /([^{}]+)\{/g) {
    my $raw = $1;
    next if $raw =~ /\@/;
    my @selectors = split /,/, $raw;
    for my $selector (@selectors) {
      $selector =~ s/^\s+|\s+$//g;
      next unless length $selector;
      $selector_count{$selector}++;
      $selector_files{$selector}{$file} = 1;
      while ($selector =~ /\.([A-Za-z_-][A-Za-z0-9_-]*)/g) {
        $css_classes{$1} = 1;
      }
    }
  }
}

my %used_classes;
for my $file ($html_file, $js_file) {
  open my $fh, "<", $file or die "Cannot read $file: $!";
  local $/;
  my $src = <$fh>;

  while ($src =~ /class=\"([^\"]+)\"/g) {
    for my $name (split /\s+/, $1) {
      next if $name eq "" || $name =~ /\$/ || $name eq "?";
      $used_classes{$name} = 1;
    }
  }
  while ($src =~ /className\s*=\s*\"([^\"]+)\"/g) {
    for my $name (split /\s+/, $1) {
      next if $name eq "" || $name =~ /\$/ || $name eq "?";
      $used_classes{$name} = 1;
    }
  }
  while ($src =~ /querySelectorAll?\(\"\.([A-Za-z0-9_-]+)\"\)/g) {
    $used_classes{$1} = 1;
  }
  while ($src =~ /closest\(\"\.([A-Za-z0-9_-]+)\"\)/g) {
    $used_classes{$1} = 1;
  }
  while ($src =~ /classList\.(?:add|remove|toggle)\(\"([A-Za-z0-9_-]+)\"/g) {
    $used_classes{$1} = 1;
  }
}

# Dynamic class construction allowlist
$used_classes{"cr-filter-chip"} = 1;
$used_classes{"cr-citation-list"} = 1;

my @orphan_css_classes = sort grep {
  !$used_classes{$_} && $_ !~ /^(is-|state-)/
} keys %css_classes;

my @missing_css_classes = sort grep {
  !$css_classes{$_} && $_ !~ /^(is-|state-)/ && $_ !~ /^\$\{/
} keys %used_classes;

my (%html_ids, %js_ids);
open my $hfh, "<", $html_file or die "Cannot read $html_file: $!";
{
  local $/;
  my $html = <$hfh>;
  while ($html =~ /id=\"([^\"]+)\"/g) {
    $html_ids{$1} = 1;
  }
}

open my $jfh, "<", $js_file or die "Cannot read $js_file: $!";
{
  local $/;
  my $js = <$jfh>;
  while ($js =~ /\$\(\"([^\"]+)\"\)/g) {
    $js_ids{$1} = 1;
  }
}

my @missing_ids = sort grep { !$html_ids{$_} } keys %js_ids;

my $tokens_file = "$public/styles/tokens.css";
my (%token_defined, %token_used);
open my $tfh, "<", $tokens_file or die "Cannot read $tokens_file: $!";
{
  local $/;
  my $tokens = <$tfh>;
  while ($tokens =~ /(--[A-Za-z0-9_-]+)\s*:/g) {
    $token_defined{$1} = 1;
  }
}

for my $file (@css_files, $js_file) {
  open my $fh, "<", $file or die "Cannot read $file: $!";
  local $/;
  my $src = <$fh>;
  while ($src =~ /var\((--[A-Za-z0-9_-]+)\)/g) {
    $token_used{$1} = 1;
  }
}

my @orphan_tokens = sort grep { !$token_used{$_} } keys %token_defined;

my @duplicate_selectors = sort grep { $selector_count{$_} > 1 } keys %selector_count;

print "STYLE AUDIT\n";
print "==========\n";
print "CSS classes defined: " . scalar(keys %css_classes) . "\n";
print "Classes used by HTML/JS: " . scalar(keys %used_classes) . "\n";
print "Orphan CSS classes: " . scalar(@orphan_css_classes) . "\n";
print "Missing CSS class definitions: " . scalar(@missing_css_classes) . "\n";
print "Duplicate selectors (informational): " . scalar(@duplicate_selectors) . "\n";
print "JS IDs missing in HTML: " . scalar(@missing_ids) . "\n";
print "Tokens defined: " . scalar(keys %token_defined) . "\n";
print "Orphan tokens: " . scalar(@orphan_tokens) . "\n";

if (@orphan_css_classes) {
  print "\nOrphan CSS classes:\n";
  print "- $_\n" for @orphan_css_classes;
}

if (@missing_css_classes) {
  print "\nMissing CSS class definitions:\n";
  print "- $_\n" for @missing_css_classes;
}

if (@missing_ids) {
  print "\nMissing HTML IDs referenced by JS:\n";
  print "- $_\n" for @missing_ids;
}

if (@orphan_tokens) {
  print "\nOrphan tokens:\n";
  print "- $_\n" for @orphan_tokens;
}

if (@duplicate_selectors) {
  print "\nDuplicate selectors (informational):\n";
  for my $selector (@duplicate_selectors) {
    my @files = sort keys %{ $selector_files{$selector} };
    print "- $selector => $selector_count{$selector} (" . join(", ", @files) . ")\n";
  }
}

# Fail only on contract breaks.
exit((@missing_css_classes || @missing_ids) ? 1 : 0);
' "$PUBLIC_DIR"
