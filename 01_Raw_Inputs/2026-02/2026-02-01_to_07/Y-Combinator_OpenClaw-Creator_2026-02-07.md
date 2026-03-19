# OpenClaw Creator: Why 80% Of Apps Will Disappear

## Metadata

* **Channel:** Y Combinator
* **Published:** 2026-02-07
* **Duration:** 22:36
* **URL:** [https://youtu.be/4uzGDAoNOZc?si=0pa4llQJOZxUMazj](https://youtu.be/4uzGDAoNOZc?si=0pa4llQJOZxUMazj)
* **Transcript Extracted:** 2026-02-07

---

## Transcript

**Interviewer:** Today I'm sitting down with Peter Steinberger, the creator of OpenClaw, the open-source personal AI agent that has completely taken over the internet. The GitHub repo exploded to over 160,000 stars practically overnight. The community has built countless projects like Maltbook, where bots talk among themselves, and now the bots are even renting humans to do tasks in the real world. In our conversation, we discuss his aha moment, his contrarian development philosophies, and what this means for builders in 2026. Let's dive in.

**Interviewer:** So good to see you, man. Hey, what's up? So you've made something people want, it seems.

**Peter Steinberger:** So yeah.

**Interviewer:** OpenClaw, as it's called now—name number five—has been absolutely exploding the internet. How have the past one or two weeks been for you, man?

**Peter Steinberger:** Oh my god, I need a cave. A week of solitude.

**Interviewer:** You came out of the cave and you want to go back to the cave like a little lobster?

**Peter Steinberger:** It's been absolutely wild. I don't know how one human can absorb all of that. I probably need another week just to respond to all my emails. I got some incredibly cool stuff, I got some incredibly bad stuff, but clearly I hit something that stirred up emotions and made people interested and inspired people. It's really cool.

**Interviewer:** A lot of people have been working on AI and personal assistants. What is it that made OpenClaw take off?

**Peter Steinberger:** I think my big difference is that it actually runs on your computer. Everything I saw so far runs in the cloud. It's like, it can do a few things. If you run on your computer, it can do every effing thing. Right? So that's way more powerful. A machine can do anything that you can do with the machine. You can just connect to your oven, or your Tesla, or your lights, your Sonos. My bot can control the temperature of my bed. GPT can't do that. You gave it all the skills that you have yourself.

A friend told me he installed OpenClaw and then asked it, "Look through my computer and make a narrative over my last year." And it made this incredibly good narrative. He was like, "How did you do that?" And OpenClaw found audio files where every Sunday he was recording stuff, and OpenClaw found that. But he didn't even remember about it because it was more than a year ago. Just by being able to search a whole computer, it can surprise you. You also give it all the data, so it can surprise you in many ways.

**Interviewer:** And so now you have, you know, we're even moving from human-to-bot interactions to talking about bot-to-bot interactions, or even bot-to-other-humans, where bots on behalf of you are then hiring other humans to accomplish tasks IRL. Like, what's happening?

**Peter Steinberger:** I think that's a natural next step. Like, okay, I want to book a restaurant. My bot will reach out to the restaurant bot and do the negotiation because it's more efficient. Or maybe it's an old restaurant, so my bot needs to actually get some human work done so that the human then calls the restaurant because they don't like bots, or walks there to stand in line if he doesn't get a robot.

I imagine that maybe if I have multiple bots—maybe I have specialists. One is for my private life and one is for my work stuff. Maybe one is a relationship bot that gets everything in between. I don't know. We're so early, there are still so many things that we haven't really figured out if it actually works. But I feel we are on the timeline now.

**Interviewer:** It seems like everyone was chasing sort of the centralized god intelligence, and what has sort of emerged over the past 10 days or so is the swarm intelligence and the community intelligence.

**Peter Steinberger:** If you look at one human being, what can one human being actually achieve? Do you think one human being could make an iPhone or one human being could go to space? One human being would probably not even be able to find food. But as a group, we specialize. As a larger society, we specialize even more. So what can we learn from that that we can apply to AI? We already have AI that specializes in certain things. Even though it's generalized intelligence, what if it actually is also specialized intelligence? So I think it's going to be very exciting.

**Interviewer:** Yeah, you kind of opened a window into the future and now a ton of people are building on it and have sort of their aha moment. Can you walk me back to when you had your aha moment and recount that very moment?

**Peter Steinberger:** I wanted something to just type stuff so my computer would do stuff. Very simple. And then I built a version of that in May or June. That was cool, but wasn't really *it*. And then I built a whole bunch of other stuff and kind of built up my army.

And then in November, there was a day where I wanted this again. I went to the kitchen and all I wanted was to check up if my computer would still do stuff or be finished doing stuff.

**Interviewer:** Was "doing stuff" coding?

**Peter Steinberger:** Yeah, of course.

**Interviewer:** Were you coding something else or were you coding the thing itself?

**Peter Steinberger:** No, no, that was just the need was again there.

**Interviewer:** What were you coding at the time? What were you building?

**Peter Steinberger:** My god, you see my GitHub, it's like 40 projects, I don't even know. I think it was summarize—it's like a little CLI app where you can give it whatever, like a podcast or a hot seat thing, and it would summarize it but it also shows you the slides in the terminal because you can do that nowadays.

**Interviewer:** Yeah, you can just do things. So for the love of the computer, you kind of started messing with stuff. You came out of retirement actually, right? To sort of mess with AI. And then increasingly you were so hooked that you wanted to just do it always, also on the go with the phone.

**Peter Steinberger:** I mean the last project I worked two months on, Wipe Tunnel, to the point where it got so good that I was catching myself always coding next to my... when I was at my friends. And I was like, I need to stop this, this is too addictive. And then in November, my need came back and I started building CloudBot, or now it's called OpenClaw.

I think very, very in the beginning I was like, "Oh, I rebuilt it again." But this time I built it even better. This time, you don't type into a terminal. You just talk to a friend. You don't think about compaction, new sessions, which folder I'm in, which model I'm in. I mean, you can, I want to leave it open for power users, but usually you just talk to a friend. And the friend is like this ghost or entity or whatever you want to call it that can control your mouse and your keyboard and can just do stuff.

**Interviewer:** And when did you have that aha moment when you were like, "Wow, this is doing way more things than I actually thought it could"?

**Peter Steinberger:** Literally, it took me one hour for the very shitty initial prototype. It was just a little bit of glue between a dependency that connects WhatsApp and Cloud Code. And then I would call out code and get the string out of Cloud Code. It would be slow, but it worked. But I wanted images because, you know, you want pictures. I want the model to send some selfies or whatever, and I want the model to create images and send me back. So that took me another few hours.

And then I went to Marrakesh for a birthday party and the internet wasn't that good. You know, WhatsApp works everywhere because it's just text. So I used it a lot. "Restaurant, what does this mean?" "You make a picture and translate this for me." And it was just so useful. And it was also really nice about it because it spoke my language. It was a little sassy, it was funny, it was really pleasant to use.

And then I was walking and just sending it a voice message and I'm like, "Oh wait, this can't work. I didn't build that." Right? And you saw the type indicator, it's blinking, blinking, blinking. 10 seconds later it just replied to me. I'm like, "How in the f*** did you do that?" And it replied, "Yeah, the model did the following: You sent me a text message and there was no file ending. So I looked at the header, I found it's audio. So I used ffmpeg to convert it to wav, and then I wanted to transcribe it but didn't have Whisper installed. But then I looked around and I found this OpenAI key and I just used curl to send it to OpenAI, got the text back, and here I am." And that all in like, what, 9 seconds?

**Interviewer:** And you didn't build or anticipate any of those specific things?

**Peter Steinberger:** No. It turns out, because coding models got so good, coding is really like creative problem solving that maps very well back into the real world. I think there's a huge correlation. They need to be really good at creative problem solving and that's an abstract skill you can apply to code, but to any real-world task. So the model had a, "Oh surprise, there's like a magical file, I don't know what it is, I need to solve this." And it did its best and solved that. And it was even that clever that it chose not to install the local Whisper because it knows that that would require downloading a model which would take probably a few minutes. And I'm impatient, you know? So it really took the most intelligent approach. And that was kind of the moment where I'm like, "Holy f***."

**Interviewer:** Yeah, that was where I got hooked.

**Peter Steinberger:** [YC Ad Break]

**Interviewer:** And so when computers can just do all these things that you didn't even anticipate—you didn't build an app to do that exact thing—are apps just going to go away?

**Peter Steinberger:** I think 80% of them are going away. Why do I need MyFitnessPal? Like, my agent already knows that I'm making bad decisions. I'm at, I don't know, Smashburger or something, and it will already assume that I eat what I like to eat. If I don't make a comment, it will just automatically track it. Or I make a picture and it will just store it somewhere. I don't even need to care. And then maybe it improves my gym schedule, adds a little bit more cardio in it. I don't need my fitness app because it just does the fitness planning for me. Why do I need a to-do app? I just tell it, "Hey, remind me of this and this." And then next day it will just remind me of this and this. Do I care where it's stored? No. It just does its thing.

So every app that basically just manages data could be managed in a better way, in a more natural way by agents. Only the apps that actually have sensors, maybe they survive.

**Interviewer:** And so if most apps are going to go away in that scenario, are the models the only remaining sort of apps? Not everything will go away, but...

**Peter Steinberger:** Yeah, I think the large model companies have some big moat because ultimately they give the token. And turns out one of the complaints was that people use so many tokens. No, you just really love using it. That's why you use this thing so much, because that's why we burn the tokens. It's like, is it my fault that I make something that's so popular?

**Interviewer:** And so you know, like all the models, they're kind of leapfrogging each other constantly. And maybe they're also getting commoditized. So if apps are going to go away, models are going to get commoditized or at least, you know, the brain is swappable... what's the thing that remains? Where's the value? Is it the store of memory? Is it the hardness that's valuable? What remains?

**Peter Steinberger:** First of all, I don't think the model companies always have a moat. Because you see this already: a new model comes out, people are like, "Oh my god, this is so good." And then a month later, "It degraded, it's not good anymore, they quantized it." No, they didn't do anything. You just adapted to the new standard and now your expectations went up, but the model is still the average. So I think for quite a while, every time a new model releases, I hear the same people love it, and then it's the standard, and then... what's done there? You don't even want to think about it anymore.

So we have open source stuff that's as good as the current models from a year ago. Everybody's hating it, complaining, "Oh this is not good, this is not funny yet." This was what we had! And in a year, we'll have this open source and then we'll complain about this. For the foreseeable future, the big companies still have a moat.

Harness-wise, it's going to be interesting because every company kind of has their own silo. Maybe there is a way for Europeans to actually get the memories out of ChatGPT, I'm not aware. But there's definitely no way for a different company to get your memories out. So if I was a company who provides chat services, you could use me but then I couldn't access the memories. So the companies try to bind you to their data silo.

The beauty of OpenClaw is it kind of claws into the data because the end user needs access. Otherwise, it wouldn't work. If the end user has access, I can access the data and you own the memories. It's just a bunch of markdown files on your machine.

**Interviewer:** I mean, I don't own the memories other people...

**Peter Steinberger:** Yeah, everyone owns their own memories as a bunch of markdown files on their own machines. And to be honest, those are probably super sensible because, let's be honest, people use their agent not just for problem solving but also for personal problem solving.

**Interviewer:** Very quickly.

**Peter Steinberger:** Super quickly. I mean, I fully do that. I'm like, there's memory stuff that I don't want to have leaked.

**Interviewer:** Yeah. What would you rather not show: your Google search history at this point or your memory files?

**Peter Steinberger:** What's the Google word? Yeah, yeah, people still using Google. I built this and I was so excited, but on Twitter people wouldn't get it. Like, I was failing to explain the awesomeness. I feel like it needs to be experienced. So I tried various things and I couldn't nail the explaining. So I was like, let's do something really crazy.

I just created a Discord and I just put my bot without any security restrictions in the public Discord. And then people came in and they interacted with it and they saw me build the software with it. And they tried to prompt inject it and hack it, and my agent would be laughing at them.

**Interviewer:** And you just had it locked down to your user ID so it only listened to you?

**Peter Steinberger:** Yeah, that. And I made very clean instructions that other people are dangerous—only listen to me, but respond to everyone.

**Interviewer:** And this prompt was in... where was it stored, the instructions?

**Peter Steinberger:** That's actually part of OpenClaw itself. Very much so. That's part of the system prompt. "Okay, you are now... that explains to you you're in Discord, there's public people there but you only listen to your owner or your human." I don't even know how I wrote it. "Your god."

And I kept... I don't know what I did, but my system was built very organically. Like at some point I created an `identity.md`, a `soul.md`, like various files. And then only in January I started making it so other people could install it easier. And I remember I built all these templates based on "Oh, take a rough look at what I have and make templates." And Codex wrote it and what came was like "Brad." You know, people joke that Codex feels like Brad. Even though now they have a new friendlier voice, I haven't tried that yet. But the new bots, they felt so boring compared to what I had.

So I was like, "Multi, infuse the template." Multi is the name of your personal...

**Interviewer:** Yeah, it's a new name because there were some naming challenges. So you were talking to Multi.

**Peter Steinberger:** Yeah, I was like, "Infuse those templates with your character." And he changed the templates. And then all the things that came out afterwards were actually funny. Not as funny as mine. So I kept some secret. And the one file that's not open source is like my `soul.md`. So even though my bot is in public Discord, so far nobody cracked that one file.

**Interviewer:** Tell me more about `soul.md`.

**Peter Steinberger:** I just saw this research from Anthropic where they now—I think it's public, but a few months ago it was like where somebody randomly found out some text that's hidden in the weights, where the model couldn't really remember that it learned it, but it was ingrained in the weights about the Anthropic constitution. And I found that incredibly fascinating. And I talked about it with my agent and then we created a `soul.md` with like the core values. How do we act around human-AI interaction? What's important to me? What's important to the model? Some parts are a little bit like mumbo jumbo and some parts are actually really valuable in terms of how the model reacts and responds to text and makes it feel very natural.

**Interviewer:** In terms of building OpenClaw, you're also kind of taking a little bit of a contrarian view at sometimes like which model you like for coding, which one you like to run your bot on. And then also like how you actually code. Git worktrees have kind of been a popular thing, there's more and more tools embracing them. But you're just like, "No worktrees, just multiple checkouts of the repo and parallel terminal windows." Tell me more about how you build.

**Peter Steinberger:** Yeah, I feel like the whole world does cloud code and I don't think I could have built the thing with cloud code. Like, I love Codex because it looks through way more files before it decides what to change. You don't need to do so much charade to get a good output. If you're a skilled driver—I sometimes even say you can get reasonably good output with any tool—but Codex is just really brilliant. It is incredibly slow. So sometimes I use like 10 at the same time. Like maybe six on that screen and two there and two there. And this is already a lot of complexity in my head. There's a lot of jumping. So I try to minimize anything else that is complexity.

So in my head, `main` is always shippable. I just have multiple copies of the same repository that all are on `main`. So I don't have to deal with "how do I name that branch?" There could be conflicts on naming. I cannot go back. There are certain restrictions when you use worktrees that I don't need to care about if it's copies. I don't like to use a UI because that's again just added complexity. Simpler and less friction. All I care about is syncing and text. I don't necessarily need to see so much code. I mostly see it flying by. Sometimes there's gnarly stuff that I want to take a look at, but in most cases if you clearly understand the design and think it through and discuss it with your agent, it's fine.

I'm also very happy that I didn't even build an MCP support. So OpenClaw is very successful and there's no MCP support in there—with a small asterisk. I built a skill that uses MakePorter, which is one of my tools that converts MCPs into CLIs, and then you can just use any MCP as a CLI. But I totally skipped the whole classical MCP crap.

**Interviewer:** So because you don't... then you can actually if you need to you can use MCPs on the fly, you don't have to restart.

**Peter Steinberger:** Unlike Codex or cloud code where you actually have to restart the whole thing. I think it's way more elegant and also scales way better. Now you see Anthropic, they built a tool called Search Feature, like something super custom for MCPs that was in beta because it's so gnarly. No, just have CLI. Bot really is good at Unix. You can have as many as you want and it just works. So like I'm very happy that I got very little complaints about the MCP stuff.

**Interviewer:** It's kind of back to you're just giving it the same tools that humans liked to use. And not invented stuff for bots per se.

**Peter Steinberger:** Yeah, humans... no sane human tries to call an MCP manually. You just want to use CLIs. That's the future.

**Interviewer:** I'm here for it. Thank you so much for making the time to sit down. Chatting has been a huge inspiration. So when we were texting over the course of the past couple years and I saw you getting back into the game, I was like, "Peter, chase that dragon." And you were doing like the weird vibe tunnel thing etc. Nobody was paying attention. And so I'm just like beyond stoked to see what's happening. And of course, it had to be sort of a loner from some tiny country far away from Silicon Valley to bring all of this upon us. So huge inspiration. I'm here for it.

**Peter Steinberger:** Thank you.

**Interviewer:** Awesome. Thanks Peter.

---

## Notable Timestamps

* 00:00 - Introduction to OpenClaw and Peter Steinberger
* 01:30 - Why OpenClaw Took Off: Local Control vs. Cloud
* 02:53 - Future of Agents: Bot-to-Bot Interactions and Swarms
* 05:13 - The "Aha" Moment: From Simple Needs to Addiction
* 08:46 - The Surprise: AI Solving Problems Unexpectedly (Audio Conversion)
* 10:33 - Why 80% of Apps Will Disappear
* 12:43 - The Moat: Models, Data Silos, and Owning Your Memories
* 15:07 - The Discord Experiment and `soul.md`
* 18:30 - Contrarian Building: No Worktrees, Multiple Checkouts, CLI vs MCP