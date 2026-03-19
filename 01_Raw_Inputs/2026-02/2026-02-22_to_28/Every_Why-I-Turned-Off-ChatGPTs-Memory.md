# Why I Turned Off ChatGPT’s Memory

### The case for keeping your AI on a need-to-know basis

## Metadata
* **Publisher:** Every
* **Author:** Mike Taylor
* **Published:** 2026-02-23
* **Type:** Blog Post
* **URL:** https://every.to/also-true-for-humans/why-i-turned-off-chatgpt-s-memory
* **Captured:** 2026-02-28

---

*Most people can’t imagine switching away from ChatGPT—it “knows them so well” thanks to its memory feature. Mike Taylor’s view is the opposite: Memory has more disadvantages than advantages. He introduces a concept he calls “context rot,” the slow buildup of stale preferences, errors, and contradictions in an LLM’s memory that quietly degrades your results. His real-life examples are as hilarious as they are insightful—ChatGPT trying to make a basic website feature “as dope as possible” thanks to a Kanye quote in his custom instructions and serving him BBQ rib advice suspiciously tailored to his Hoboken zip code. Sometimes it’s better to forget.—Kate Lee*

Memory is frequently described as ChatGPT’s “killer feature.” Many people tell me they can’t switch to Gemini or Claude because the OpenAI tool “knows them so well.”

I have memory turned off.

The memory feature allows ChatGPT to save and recall information it thinks is important about you, as well as reference past chats to shape its responses. While I can see how this could make a “helpful assistant” more helpful, I don’t use it.

My background is in internet marketing, where it was common to open Google in incognito mode so you didn’t bias your results when checking your client’s ranking. Since Google search results are personalized, your client would show up first if you search from your account. You click on it so much that Google knows you like it. I have the same issue today on Spotify—the algorithm recommends both Rage Against the Machine and the K-Pop Demon Hunters soundtrack, because my six-year-old daughter shares my account.

The argument for turning off memory is the same. I want unbiased results from ChatGPT, based on context that I carefully curated and put in the prompt, so I know how it made its decision. With memory, anything from your past chats could affect the results in ways that are hard to predict.

While the memory feature might be worth the loss of control for most users of ChatGPT, it can lead to unexpected and difficult-to-diagnose problems. Hear me out as I explain the problems you might run into, and hopefully, I’ll convince you to be careful with memory.

## Kanye in context
Before memory was released, I was experimenting with “custom instructions,” which allowed you to tell ChatGPT how you want it to respond. This was a primitive form of memory, simply a text document you could update to craft ChatGPT’s identity toward your personal preferences. Among other things, I had inserted an old (read: pre-meltdown) Kanye West quote that I thought would steer ChatGPT away from its generic responses:

“For me, first of all, dopeness is what I like the most. Dopeness. People who want to make things as dope as possible. And, by default, make money from it. The thing that I like the least are people who only want to make money from things whether they’re dope or not. And especially make money at making things as least dope as possible.”

While I can’t fault it for effort, ChatGPT massively over-indexed on this quote and referenced it in basically every chat session. For example, when ChatGPT (this was pre-Codex when we were all just copying and pasting between ChatGPT and our code editors) built a collapsible section on a webpage, it claimed to have made the basic feature “as dope as possible.”

It applied this quote to cases as varied as interior decor (relevant), marketing plans (less relevant), and Python error debugging (irrelevant). Technically, it’s doing what I asked, but a human would be more judicious with how he or she applied these custom instructions.

Even a throwaway line in your context window can have a big impact on the results you get from AI. These models are trained to be extremely eager to please, and so you need to manage the context you provide them, lest they get distracted, confused, or obsessed with what’s in there, degrading your results.

The Kanye example was obviously silly and easy to catch, but sometimes memory issues are more subtle. I turned memory back on while writing this piece and didn’t immediately notice any major issues. Then I asked ChatGPT for help with some barbeque ribs I’m cooking. It came back with “Hoboken Dinner Upgrade Ideas,” recommending Trader Joe’s corn bread mix and “American-dad-core” mac and cheese. Seeing something so ham-fistedly tailored to my life (I just relocated to Hoboken) was disconcerting and mildly annoying.

Did I get genuinely good advice for ribs, or is it tailoring suggestions to what’s near my apartment? I love Trader Joe’s, but would it have recommended a better option if it hadn’t recalled me shopping there by looking at relevant past chat history? What relevance does Hoboken have to cooking ribs? Would it give me different advice if I lived in Austin, a place known for its barbeque? Did it give me the easier, less authentic recipe, something for a stereotypical busy Hoboken dad? I wondered how many biased responses I had missed in the past week. I switched memory back off.

## Context rot
My Kanye and barbeque experiences are a small, self-inflicted version of a much bigger problem. Drew Breunig, a data science and product leader, published a useful taxonomy of how contexts fail in AI systems. He highlights the kind of problems you might run into when using memory.

### Context poisoning
The simplest failure is what the Google Gemini team calls context poisoning: A hallucination or error gets into the context, and the model keeps referencing it like gospel. The AI develops strategies around a goal that doesn’t exist or “remembers” something about you that never happened. If ChatGPT misinterprets something from a past conversation and saves it to memory, that bad signal is now shaping future responses. You’d never know you were getting poisoned results unless you went digging.

### Context distraction
Then there’s context distraction. The Gemini team found that as their Pokémon-playing agent’s context grew past 100,000 tokens, it stopped synthesizing new strategies and started repeating actions from its history. It got stuck in a loop of its own past.

A Databricks study found that model accuracy starts declining well before the context window is full, sometimes as early as 32,000 tokens. With memory features, you have no idea how full that context window is, and the more information that’s crammed in there, the more likely you are to overload the model with distracting, confusing, or conflicting information.

### Context confusion
The next flavor of context trouble is context confusion, or what happened with my Kanye quote. You put something in the prompt, and the model is forced to pay attention to anything in that prompt. It doesn’t know that the Kanye quote was meant to be a loose creative vibe and not a binding directive for every interaction.

Berkeley’s Function-Calling Leaderboard, which benchmarks how well AI models use external tools (functions a model can use in your code) and APIs, demonstrates this phenomenon at scale: Every model performs worse when given more tools, and all of them will occasionally call tools that aren’t relevant to the task. If irrelevant tool definitions trip up frontier models, imagine what a messy pile of half-remembered user preferences does.

### Context clash
Finally, there’s context clash, when different parts of the context actively contradict each other. A Microsoft and Salesforce team found that when they split a single prompt into a multi-turn conversation—giving the model information in stages rather than all at once—performance dropped by an average of 39 percent. The model was eager to jump to an answer before it had the full context, and its early, incomplete attempts at answering remained in the context, polluting its later reasoning. It couldn’t recover from its own wrong turns. Now imagine this playing out across months of saved memories, where your preferences from January might directly conflict with what you told it in June, and the model is struggling to reconcile both.

All of these failures—context poisoning, distraction, confusion, and clash—add up to what I call context rot. It’s not one dramatic failure; it’s the slow accumulation of stale preferences, misremembered facts, outdated goals, and contradictory signals that gradually degrade the quality of the AI’s response. The models are too polite to tell you your context is a mess. Instead, their output quietly gets worse, and you blame the model instead of the soil it’s growing in.

## Memory wipe
I keep memory turned off, not just because I’m paranoid about context rot, but because forgetting is a superpower

In my piece on “New Taylorism” I argued that management can finally become a hard science because AI coworkers are stateless. You can wipe their memory and start fresh, and they have no idea. It’s like the TV show Severance—every session begins with zero baggage or knowledge of the outside world, and no memory of the time you swore at it or tried the same task 15 different ways.

Average users of ChatGPT don’t A/B test their prompts like I do, and religiously save them in GitHub or Google Drive, but the principle is the same: When you get a recommendation from ChatGPT, you have to ask yourself what might be influencing it. Is it suggesting intimate dinners for your wife’s surprise party because that’s what she’d want, or because you told it that you hate large gatherings? Is it drafting your emails in a formal tone because the situation calls for it, or because you asked it to sound professional for a job application?

Resetting to a clean slate by starting a new chat session (with memory off) is what lets you understand how ChatGPT makes its decisions. You know exactly what context it’s using because it’s only what you pasted into this prompt, not something from weeks or months ago that might be outdated, irrelevant, or wrong. The context you provide is the only variable, which makes it a true experiment—something you could never do with a human employee who remembers (and resents) the last round of testing.

Turn on memory, and you lose that control. Your context becomes a compost heap where you can’t isolate what’s helping and what’s hurting. The prompts I use get better over time precisely because the AI doesn’t remember a thing. Memory will work better as models get smarter, but if you want ultimate control over your digital workers, turn memory off.