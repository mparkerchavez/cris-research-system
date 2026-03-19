# Agent Observability Powers Agent Evaluation

## Metadata

* **Channel:** LangChain
* **Published:** 2026-02-09
* **Duration:** 47:12
* **URL:** [https://www.youtube.com/watch?v=reISMhbZ2XE](https://www.youtube.com/watch?v=reISMhbZ2XE)
* **Transcript Extracted:** 2026-02-09

---

## Transcript

**Harrison:** Welcome everyone to this webinar on observing agents and how agent observability powers agent evaluation. My name is Harrison, I'm the co-founder and CEO. Joined with me is Vivek. Do you want to do a quick intro?

**Vivek:** Yeah, sounds good. Super excited to be talking about this. I'm Vivek, I work on a bunch of our deep agents work here at LinkedIn.

**Harrison:** Awesome. So it's right at the top of the hour and I see a bunch of people still joining, so we will probably preamble for a little bit and then jump right into it. The reason Vivek is here is because today both Anthropic and OpenAI launched things, and testing out these models and seeing how these models are doing is a very topical topic for this webinar, which is all about observability and powering agent evaluation.

The run of show will basically be: I'll talk for a little bit in more of a conceptual way around how we think about agent observability here and how we think about that powering agent evals. I'll probably do that for like 15 or 20 minutes and then I'll hand it off to Vivek who will talk for 10 or so minutes in a more hands-on, practical example of how to apply this to evaluating Codex—or I guess the new Codex model isn't available via the API, but the old Codex model and the new Opus model. We'll show off some very practical and hands-on examples of that, and then we'll leave about 10 or so minutes at the end for any questions that folks have.

If you have questions throughout, what we'll be doing is using the Q&A feature. If you put things there, I think you can upvote and downvote questions and we'll take a look at some of the most popular ones and answer those at the end.

Before jumping into a few slides that I have to talk about observability and eval, maybe just some level setting. We see these being two of the biggest pain points for developers building apps. We generally see that observability is probably the place you start and then evals are maybe the place that you get stuck. Evals are harder. I think observability is more of... there's an easier solution to observability. If you're not familiar with LangSmith, Vivek will show that off later on. I'll actually try to talk a little bit about this more conceptually because I think that's more interesting.

Observability is relatively easy to set up and see what's happening inside your agent. Evals is harder because you have to build up your own data sets and you have to build up your own metrics. So eval is generally when we see people start to think about working with us or working with the solution here, but in our minds, they're very tightly coupled and we think observability powers eval in a bunch of interesting ways. Let me share my screen and jump into more of what exactly I mean by that.

We're going through a big change in the world. A few years ago software was everything that was being built, and now a lot of folks are focused on building LLM apps and increasingly so on agents. These operate in pretty fundamentally different ways which is giving rise to fundamentally new challenges and fundamentally new tooling that's needed.

Software is deterministic. You write a program, you run it once, you run it twice, it says the same thing each time. LLM apps are of course nondeterministic and they also suffer from prompt sensitivity. But for single call LLM apps, it's still relatively constrained. You call the LLM once with some context and that context is usually fixed. Plus you add in the user question, there's some variable there, but that context is passed into the LLM. There's maybe some randomness, maybe some sensitivity to user input, and you get back an answer, but it's generally one step.

With agents, you call these LLMs in a loop or in sequences, and these non-deterministic errors or differences start to compound. You get emergent behavior from these agents as they start to discover and work with tools in a way that you didn't know they could even do. That's great, but that also means that a lot of the logic of your app no longer just lives purely in the code.

What I mean by that is, if you think about what the code to define an agent looks like, let's say you're using a framework like LangChain or one that you built in-house, you probably have this concept of an agent abstraction that takes in a prompt and a list of tools. So your app in code looks like this agent class with a prompt and with some tools that are passed to it. But you don't actually know what that does until you run it because there are so many different ways that that could be interpreted. There are so many different potential inputs to that because usually the input is some natural language. So you don't actually know what your agent's going to do until it runs. The code no longer fully documents the core logic of your app. That's one of the fundamental differences between software and agents in our opinion.

That changes things from when things mess up. You go from debugging code to debugging reasoning. In software, you know software is deterministic. You've got the code that documents everything pretty perfectly, that's a source of truth. You debug things by identifying failed functions in a stack trace. Generally, your tests and CI are pretty different and pretty disparate from your observability stack.

That starts to change a little bit with agents because now agents are nondeterministic, which means you don't really know what's going to happen until you run them, which means traces—the observability for them—are your sources of truth. Debugging really turns from debugging stack traces to debugging failures and reasoning. What goes into the LLM, what comes out of it, debugging some of the context engineering around it. In order to do this well you need to track threads of conversations, tools, reasoning context, and all of these can also be tied into things like eval.

Maybe starting from what we think the primitives of agent observability are. These are the core components that power agent observability in ascending order of complexity. First, you've got **Runs**. This is like a single execution turn. You can think of this as a single LLM call. This already has a bunch of context: it's got the inputs, including tools, parameters like temperature, and then the outputs. The outputs aren't just text anymore; they're a message which could have reasoning, a final response, or tool calls.

A **Trace** then consists of basically a list of these runs, and you could have nested traces. A trace is like a full agent execution from start to finish without any human intervention. That human intervention is the piece that separates traces from **Threads**, because threads are grouping these traces together where there's human intervention in between. If you think about a chatbot that you interact with, your message is a form of human intervention. You send a message, it runs—the agent might call some tools, those tools get executed—all of these would be individual runs that add up to a trace. It finishes, you send another human message that kicks off another trace. So your whole conversation is kind of like this thread.

How does agent evaluation differ from software evaluation? We've talked about observability, I now want to talk about eval and then I'll tie them together. First, you're testing reasoning, not code paths. Just like there's these different primitives of observability (runs, traces, threads), you might want to evaluate reasoning across all of these different dimensions.

You might want to test a single step of your agent. This is just like a single LLM call. If you make one LLM call with this input, does it produce the output that you expect? This is what we call a single-step test. It's generally the easiest and fastest. Did the agent make the right decision at this moment in time?

A full turn is then like a run of the agent. This is passing in top-level user input, letting it run, seeing what the end result is, and then testing that output. The output could be a message, a sequence of messages, or any artifacts the agent creates along the way.

Multi-turn evals are a step above where you don't just call it with one input, you call it with a sequence of inputs. This brings in other complications. You have to figure out the sequence of inputs.

The second thing that differs is that production is really where you discover what to test for online. This gets back to the fact that you don't really know what agents do until you ship them in production. One of the best things that we see companies do when they're building agents is ship early and ship often. Even if it's just to a small cohort of users, that's where you really start to see user behavior and user inputs. That's where you start to build up these test sets that you're going to test for later on.

Diving a little bit more into single-step evaluation. This is good for validating individual agents in isolation. For example, if every time a user comes in requesting a meeting, the first thing you need to do is check the calendar. This is a good check to see: does the agent call the "check calendar" tool first? Generally, these are fast to execute and have clear pass/fail criteria.

Full turn evaluations validate the complete agent runs from input to final output. An example might be if you're using a coding agent, you'd let it run for a while: Did the coding agent produce working, tested code? The benefits are that it includes real behavior of the agent along the trajectory, including tool usage and state changes like changes to the file system. This is definitely more realistic.

And then multi-turn validating threads across multiple conversations/turns. There you can do things like test whether it remembers previous things mentioned in previous turns or test that it asks appropriate follow-up questions. The pro is this is usually the most realistic test of production behavior because most agents have some conversational aspect. The downside is this is actually quite hard to do because the second user message might totally depend on the first user message response.

So how does agent observability power these different types? First, traces power manually debugging. I would absolutely call manual debugging a form of manual ad hoc evaluation. Traces power this because you can just look at the trace, see what went wrong, open it up—the trace has all the individual runs so you can go to a particular run, open it up in a playground, and play around with it there.

Traces power offline evaluation. Offline evaluation is when you build up a data set and run benchmarking runs over it. Oftentimes these data sets are built from production traces because again, you don't actually know what you should be testing for until you see how users are using it. So the workflow usually is: I'm logging everything to LangSmith. The user will say "Hey, this went wrong." I'll go find the production trace in LangSmith, see where it failed. Maybe I want to test the whole trace or a particular point. I'll find the state of the agent at that failure point because tracing tracks all the inputs and outputs. That state becomes the test case, and then I'll go into my offline eval cycle where I'll make changes to a prompt, run the prompt over, and try to fix it.

Traces power online evals. These are traces coming into production. Online evals run over these traces. One big difference here compared to offline evals is that in online evals you obviously don't have the ground truth. So the types of evaluators that you're running are pretty different. What types of things can you check for? You can flag for unusual tool call patterns. You can check to see if the LLM is calling the same tool a bunch in a row.

Vivek, maybe you can touch on this later. I think you actually did something kind of in the loop when you were trying to improve our agent harness?

**Vivek:** Exactly. Quick sneak peek: when we're trying to make our agents better, we'll measure every single thing they're doing. When we dig into those, we observe these weird pathologies that agents sort of trip up on. One thing that's really common with these reasoning models is that although they think through a problem a lot, they will get down this rabbit hole where they just keep editing the same thing over and over again, often a file. Usually when that happens, we see the result is a failure. It's just spiraling out of control.

So we have deterministic hooks that we can put into our agent harness framework that detects like, "Hey, you edited this file five or six times, take a step back and re-evaluate your decision or go plan a little bit more." We basically use traces to observe these pathologies, inject our experiments to try to make the harness better, and then reevaluate.

**Harrison:** You can do something like that as online eval, and it won't inject it back into the live running of the agent but you can use it to fix up things after the fact. This is a pretty generic check that we can add off the shelf.

Other things you can test for: efficiency monitoring (testing if the LLM is giving way too big or small outputs), quality scoring (detecting hallucinations), and failure alerts.

Ad hoc insights is another thing that traces power. This is one of the cooler things we have in LangSmith. You send us all your traces and then you can run insights analysis over it and ask questions like "How are people using my agents?" or "Where and why are users getting frustrated?" We cluster those and then you can compare different clusters.

One of the core theses that we're realizing is that agent observability powers a bunch of other things that is a little bit different than in software. In software, observability kind of sits to the side. With agents, it's much more part of the overall loop of application development.

Before going to questions, I want to switch over to Vivek to do the deep dive into some of the Opus and Codex stuff.

**Vivek:** Awesome, thanks Harrison. Let me get my screen up as well.

Real quick over the next 10 minutes, there's a few things that I want to cover that basically takes a lot of Harrison's conceptual content and goes over what is the actual workflow that our team is doing every day when we're trying to make our agent better.

The team that I work on leads a bunch of stuff for our library called Deep Agents. Basically what this is, is our harness which allows you to take any model and customize it for your task—write your own prompts, add your own tools, add your own hooks. What our team does is we want to make that the best place to customize your harness but also a great out-of-the-box experience for coding. The way we actually do that is we look at existing benchmarks and existing evals and try to make them better.

One of the ones that all of the Frontier Labs test on is called Terminal Bench and Terminal Bench 2.0. I have the releases out here for Codex and Opus 4.6. You can see there's a really big increase from GPT 5.2 Codex to GPT 5.3 Codex. So immediately for us we're like, okay, that's something we need to take a look at. That's something we need to test in our harness to make sure that the user experience out of the box is amazing. Same thing with Opus.

Before jumping to the traces, I'll just show you our mental model of the day-to-day. We have the **Model** (Codex, Opus, Sonnet, Haiku). And then we have the **Harness**, which is what we provide. That's tons of opinionated, "batteries included" built-ins that you can tweak. Things like built-in prompts: "Hey, if you're approaching this problem, planning in this way is really helpful," or "Delegating to sub-agents is really helpful."

Another thing that's very particular about these benchmarks is **Environment Context**. This has a really good analogy to your day-to-day coding: what's in my file system? How is my repository structured? What are the coding guidelines? All of this stuff you want almost auto-injected into the model context. These are priors that we try to bake into the model and the harness. Then there's **Middlewares** and **Sub-agents**. In Deep Agents, you're not limited to one model provider. Use them all together. When Codex 5.3 is out, I'm going to use Codex 5.3 and Opus 4.6 together to see if we can push the frontier.

Now I'm going to dive into LangSmith to show you how I manually look at traces. I had a few up already. This is Opus 4.6. Harrison DM'd me immediately and I went to get another run going.

Let me show you what Terminal Bench is like so you can get a feel of the task. The task description is auto-injected from Terminal Bench into the model. It looks like a human message: "Complete this implementation, define the dominant eigenvalue vector..."

The immediate thing I look for is: what is the first step that the model made? "Let me start by reading the existing files to understand the problem." Why do I care about that? Because I wrote a very detailed prompt with the team about how you should actually start doing things. You are a Deep Agent, powerful coding AI agent.

One thing that comes up over and over again is there's no human to help the model, but the model doesn't know that. So sometimes it will prematurely stop or it will ask a human, "Can you respond to me?" As we're moving into the regime of "give agent a task, it works almost async, and then I come and review," that's not something you want in your agent behavior.

How do we enforce that? I talked a little bit about middlewares. Think of middlewares as hooks around model actions that execute deterministic behavior. I have a checklist basically. In coding agents, verification is really crucial because code is verifiable—I can generate tests, I can do linting. But another thing we can do is call these pre-completion checklist middlewares. If the model tries to finish, I can say, "Hey, before you say you're done, can you go back and look at the checklist file to make sure that you've actually done each of these steps?"

This is what I'm looking at every day: what was the first action? What was the second action?

Terminal Bench has 89 tasks. I'm running this for multiple models. I'm just one person. There is no way I'm going to be able to read all of this data. That's when generating reports from your tracing data comes in, which is super valuable. But you can't start on this journey if you don't start tracing your projects from the start.

I'll show you this skill: a LangSmith Trace Analyzer skill. It uses LangFetch to pull the traces for my project into my local environment. I have markdown files that tell it: "Hey, if we're doing a Terminal Bench analysis, I want you to group all of the failure modes together, and then I want you to propose potential fixes." Then our team will actually human review some of those. This all happens in parallel.

What do we get out of that? We get a report. This is a growing artifact that we can share with the team. I'll show you one from yesterday. We ran this on Codex 5.2 Extra High and we got 65.2% pass rate. That would have been number one yesterday. With the new releases today, I'm going to rerun on Opus and see how much better we can get.

It categorizes the errors: "Hey, these are the mistakes we were making." I really like that it's not just agent logical errors. Sometimes it's infrastructure errors—like the sandbox died. These are all feedback loops that we can use.

So, I put everything into LangSmith, I take a look at them, I read them, I update my prompts, update my tool descriptions, try using multiple models. And when I have a critical mass, I'll run this workflow which generates this report using our agent skills.

**Harrison:** Awesome. Hopefully that was a good mix of conceptual ways we think about things but also some hands-on stuff. I think we got about 15 minutes left, so now we can jump into some of the questions.

**Q: What is your intuition on when folks will have continuous pipelines, observability to eval to post-training in prod? Is test-time compute the way to go?**

**Harrison:** I think part of this is very similar to memory. I view memory as a way of improving over time, just like post-training would be. So yeah, I think that would probably fall under the test-time compute part. It's just a system of setting up all this pipelining of data. You have to take these traces, do something with them (like change the prompt), test it, commit it, and release. I think we see very basic aspects of memory being present already but still very early on.

**Vivek:** I agree. It's not post-training in terms of RL post-training, but there is a whole other class of training approaches which is like reflective optimization at scale. Basically, take a bunch of traces which have signal in them, distill the learnings from them, and then update the things that aren't the weights. That's everything in the harness. You can get even bigger scales of improvement than you would have got from switching the model.

**Q: Are you using sandboxes for insights at scale?**

**Harrison:** For our insights job right now, we're actually not using sandboxes. We're using Deep Agents which comes with a virtual file system. We do use sandboxes in other places and are generally pretty bullish on them.

**Q: Do you see Agentic Ops being looked after by operations/DevOps/SRE teams or will a new role for agentic operations emerge?**

**Harrison:** I think there will be a new role. When you're an SRE, you're looking at software errors and system errors. Agentic ops is subject matter experts looking at something and saying, "Hey, this is an error because the agent said X and it should have said Y." DevOps will still be important for parts of the agent, but for the agent logic, that is different folks—subject matter experts.

**Q: How prevalent are agentic deployments today?**

**Vivek:** We are in the future and the future is definitely accelerating. More and more people are building agentic or agentic-adjacent apps. Customer service use cases are one—places where it's easier to jump into agents rather than enumerating everything in the workflow. Also seeing interesting ones across finance and biology; places where you have to crunch a bunch of data and make decisions.

**Q: How many tests would you recommend to run? Given the systems are probabilistic?**

**Harrison:** It probably depends on how high of confidence you want.

**Vivek:** It depends on the data set. People usually run it 3 to 5 times. For long horizon agent traces where one step can derail you, it's worth running it a few times. For simple classification ones, maybe one or two times is good.

**Q: How about leveraging observability to increase the security of Agentic applications?**

**Harrison:** Once you have these traces, you can run things over them online or ad hoc to test for malicious activity. Examples: testing for prompt injections, indirect prompt injections, or testing whether API keys are being leaked.

**Q: What is the best/recommended way to get this integrated into a new agent development workflow?**

**Harrison:** Step one is just set up tracing. We have integrations with LangChain, LangGraph, CrewAI, OpenAI SDK, and we support OTel.

**Vivek:** After you set up tracing, just send me the trace. Use the agent to do something meaningful to your team. Once I get a critical mass of honestly like five, I'll review it. Manually go through it, especially if something went wrong, and then try to aggregate thoughts and make improvements.

**Harrison:** Rapid fire questions:

* **Any plan for native gateway?** No.
* **API to turn trace on/off?** Yes, check forums.
* **Cost simulator?** We provide the data, you do the forecast.
* **Retry/Fallback model settings?** Yes, on the roadmap.

**Harrison:** All these questions have been great. If there's anything I can leave you guys with, it would be that observability powers all of this. I would set up observability and tracing specifically. Observability for agents comes in way earlier. Thanks for coming.

---

## Notable Timestamps

* 00:00 - Introduction and Agenda
* 00:03 - Conceptualizing Agent Observability vs. Software Observability
* 00:07 - Primitives of Agent Observability (Runs, Traces, Threads)
* 00:09 - Agent Evaluation vs. Software Evaluation
* 00:16 - How Observability Powers Evaluation (Offline, Online, Ad-hoc)
* 00:22 - Hands-on Workflow with Deep Agents and Benchmarks (Vivek)
* 00:25 - Analyzing Traces in LangSmith
* 00:30 - Automated Trace Analysis and Reporting
* 00:32 - Q&A Session