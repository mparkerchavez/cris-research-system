# How We Built 'Claudie,' Our AI Project Manager (Full Walkthrough)

## Metadata

* **Channel:** Every
* **Published:** 2026-02-04
* **Duration:** 47:15
* **URL:** [https://youtu.be/LG943MX-Krg?si=fzPQI4mMh4hYJZTr](https://www.google.com/search?q=https://youtu.be/LG943MX-Krg%3Fsi%3DfzPQI4mMh4hYJZTr)
* **Transcript Extracted:** 2026-02-04

---

## Transcript

**Dan Shipper:** For AI to be useful to a company, it needs to be a coordinated effort. Claudie is our project manager for the consulting work that we do with our clients. You just launched four sub-agents to look through your Gmail, look through your calendar, look through your Drive, look through your meetings to get context on the project. And then it's going to go and gather that information and put it in the right place into the spreadsheets that you use to run the business. I just want to pause and be like, that is crazy.

**Natalia:** That's kind of crazy. I mean, the only thing that's crazier is that the alternative to Claudie doing this is me doing this. I am a bona fide vibe code addict at this point.

**Dan Shipper:** Natalia, welcome to the show.

**Natalia:** Hey Dan, good to see you. Happy to be here.

**Dan Shipper:** Good to see you too. So for people who don't know, you are the Head of Consulting at Every. We've known each other for a really long time. You've never been on the podcast even though you've been Head of Consulting for a while now. I think you've been with us for like nine months or so and you've done a fantastic job. So I'm just really excited to get you on the podcast and share who you are and what you know with people.

**Natalia:** Thanks. Yeah, I love our community and the podcast and just excited to chat and also hear how other people are thinking about consulting and AI in their companies. So yeah, happy to be here.

**Dan Shipper:** Awesome. So one of the things I think could be super helpful for you to share is, over the last nine months, you've had a front-row seat talking to some of the top companies in the world about how they do AI deployments. And those are people that have reached out just to chat, those are clients that you work with doing a lot of training and integration/implementation work with like hedge funds, PE firms, Fortune 500 companies—lots of name brands that you know about.

And so I just feel like you've had this front-row seat for what works and what doesn't, and what are the patterns that the companies that are really doing well at AI adoption/AI transformation are following. I'd love for you to share some of those things.

**Natalia:** Yeah, that's true. I mean, I think we have been in a really unique position in the consulting work that we do at Every because I personally have spoken to over a hundred companies in the past year, hearing their concerns around how they could be using AI, trying to benchmark how other competitors might be using AI, and then trying to get a sense of what actually works.

It really comes down to two things. We talked about this in a post that we did a few months ago about the learnings from those 100 companies that we talked to. One is you really need an organized effort. For AI to be useful to a company, it needs to be a coordinated effort. For AI to be a high-leverage tool at any given company, it needs to come from the top down.

So unlike historic software where someone heard that Asana was helpful for a company to use and they just let the CTO sort of buy it and then hope that people would use it—if there isn't a coordinated effort to understand what the possibilities are in using AI at a company, creating tailored opportunities to actually getting leverage and value out of those use cases, and then tracking how people are actually using it... AI really kind of goes nowhere. It ends up being that there are a few high-powered users that get a ton of leverage out of it and then everyone else is sort of floundering.

So there's really two things that we see working well at companies. One is it comes from the top down, so leadership understands that this is a really high-leverage tool and it's fundamentally changing the way that we think and relate to work. And two, they're really giving people an opportunity to become champions and owners of what it means to work with AI, and creative power to explore how to rethink their roles and how to train other peers and other people to use AI really effectively given this new paradigm that we're in.

So it coming from the top down, there's a coordinated effort, and AI champions really being empowered to think creatively, try, experiment, fail around AI initiatives, and then really doubling down on the things that really work.

**Dan Shipper:** Yeah, that makes a lot of sense. I think some color I can give from my seat—because I don't see nearly as much as you, but I do see a lot—on the top-down front, the CEOs that are actually doing, not just saying you need to do this, but actually doing it... those are the companies that go the furthest. You will probably go as far as your CEO has gone in terms of AI adoption. It's not something that the CEO can delegate.

The ones that are really far ahead, they're in ChatGPT, they're in Claude Code, they're trying new stuff and being excited about it. Tobi from Shopify is a good public example where he's just hacking on stuff on the weekends. You don't necessarily have to be that far, but Shopify's culture is a lot different and will be way different in a year because of that.

And then the bottoms-up thing that you're alluding to is inside of any organization there are people who are just natural early adopters. Your job as an executive who's leading your org is to identify those people and spread what they know and elevate their status so that they can kind of pave the path for everyone else who is maybe super valuable but is not naturally just going to try some new technology, but will use it if they're shown, "Hey, this is actually something that is going to help you in your job."

**Natalia:** Yeah. I mean, Dan, I feel this with you all the time. You know, a new model will come out and you'll be like, "Why haven't you run this through X model?" And I'll be like, "You're right, why haven't I run it through this model?" But also, I see it internally in the ways that it comes up naturally. In our Monday standups, someone will say they were tinkering with a whole new use case or application, and then the rest of us will sort of see there's this new dimension of what is possible.

It's exciting. When it works, it's exciting. But you need to be in this creative space where you're trying, you're failing, it's not really working, it is really working, it's really powerful... and then when you see what's possible, then you really understand where you can go and just how far it can take you.

**Dan Shipper:** Do you have any specific stories—obviously we can't share from clients by name—but do you have any specific stories about unlocks that you've seen that were particularly powerful? Maybe it's something that we've done with our clients or just something that you've seen that maybe feels a little bit counterintuitive. Because I could imagine people listening to this and being like, "Yeah, that sounds good." Like, generally it's great if the CEO is into AI, generally it's great to promote your power users internally. But I want to get down into the nitty-gritty of here are some actual concrete stuff that is maybe a little bit counterintuitive or is a really big unlock versus the effort required. What comes to mind?

**Natalia:** There's two things that come to mind. One is with a private equity firm that we started working with last year that we're still working with. That one comes to mind because our partner, kind of like our day-to-day liaison at that firm, is both brilliant technically but his superpower is actually that he understands the people dynamics around AI really, really well.

He's taken it upon himself to roll out AI at his firm and he understands that it's a technical challenge, but what he really understands is that it's a people challenge. Because he's at a private equity firm, and like a lot of other investment firms, there's a lack of bandwidth. There's a lack of capacity to try a new technology, see it fail. There's people that are more advanced teams that are already using it in pretty advanced, interesting ways. There's other teams that just haven't had capacity to implement it.

So one of the things that we did together is we started out our work together by him sitting down with the investors at his firm. He basically mapped out every single task that they do to the most detailed end. Every single task that they do from research to diligence to market mapping to portfolio management to just the day-to-day of running their lives as investors.

So what we ended up with was the starting point of a very detailed view of what it looks like at this firm for an investor to do their job, and what that looks like also by team, because it can vary quite a lot depending on what the strategy is. And then what we did is we looked at that long list of tasks for that firm and we went through and highlighted where there are opportunities to use AI that are really high leverage.

So what we ended up with is this map that we end up creating for all of the clients that we work with, but it was so detailed that we could really be very precise about looking for solutions that would give the team not just bandwidth but really high leverage in any of the training and work that we did together. And that's the kind of work that's only possible when you have someone on the inside who is not just describing the work and workflows that teams rely on generally, but very specifically to the work that they do and the way in which they approach or think about their work.

And it's made it so that in the training and the enablement and the tools that we've been able to develop together, there's this moment—this aha moment—that is wild. Where investors will kind of come and realize that there is a new way that they can write an investment memo that previously took two to three weeks and they can now get a really high-quality draft in literally 30 minutes. That's only possible when you have someone on the inside who understands all of the elements.

**Dan Shipper:** That's interesting. Tell me more about that moment and what that kind of automation or workflow looks like. Are they using ChatGPT? Are they using Claude Code? Go more deep into that.

**Natalia:** So in that case, it's a few things. One is this particular firm has a lot of resources in SharePoint around the thesis that they have—their investment thesis. This is kind of like the IP of the firm, right? They've spent a decade, if not more, really thinking about how they approach a particular area of investment. And when they're diligencing a new company, they want to understand, given this repository of knowledge that they've accumulated over a decade, how should they be thinking about this opportunity beyond just the number crunching?

That's something that is really quite onerous. It's a huge task to take on to really read that and then digest how it compares. And of course, that's something that ChatGPT is able to do very effectively. So what it looks like for them is connecting the right context—really the right sources of data—and then funneling it through this prompt that is trained to understand how they think about that particular investment strategy.

Basically just creating a set of GPTs and prompts that make it so that it's really easy to synthesize all of that information into an investment memo that really gives them sort of that general rubric of how that company compares to this broader opportunity and to the decade of information that they've collected. That's something that again, an analyst, an associate, or principal spend two to three weeks to pull together before it goes to the IC (Investment Committee), and now you get a really solid draft in like 30 minutes.

**Dan Shipper:** That's really interesting. And I think that's actually a broad general pattern that we see in a lot of companies, even in our own company. The first one, the obvious one, is connect the AI to all your data sources. Which is hard, but that's sort of table stakes. It needs to be connected to the place where all the context lives.

But then the other thing that's been happening, especially as our org and lots of other orgs are transitioning more into an agent-native world—where they're using Claude Code or they're using Coworker or other tools where you expect the agent to be going off and doing some work for 20 minutes—is specialized prompting. Once you have the connections to all the data, it's really important to have the prompt or the skill that you've built be able to tell the AI, "Hey, here's how you find the specific thing that you want."

Like for example, for us, if you wanted to figure out what our revenue is, there's like three different places you could go. You can go into Stripe, you could go into ChartMogul, maybe you could go into PostHog. But our Head of Growth, Austin, has a particular way that he's defined what our MRR is. Instead of forcing the agent to figure that out from scratch every single time, putting into place "here's how we think about what MRR is" transfers into value. For one of these clients, like "here's how we think about this sector and here's where you get the data for this particular sector"—that's where a lot of the value is and what makes your use of AI different from someone else's.

**Natalia:** Yeah, that's totally right. I think it's the hardest part of AI actually. This is the part that has been so magical at this particular firm that we've been working with. Our partner Jonathan basically interviewed every single investor and every single team to really understand the nuance in which a team collectively thinks about every part of the investment memo. This work that we've been able to do together really would not have been possible if it didn't have such a high degree of tailoring.

You know, this is like Savile Row sort of prompt tailoring. It's so specific—the way that numbers show up, the way that figures show up, the way that they express or think internally around this stuff. It's really important. And the prompts reflect that. And so the prompts really end up being this analyst that does really high-quality work that is dependable.

**Dan Shipper:** That's so cool. I know we've also done a lot of work with hedge funds and also with tech companies. Any other examples you want to share in those domains?

**Natalia:** Yeah. There's a really interesting pattern that we're seeing at one of the tech companies that we're working with right now. We know that when it comes to working with engineers and with engineering orgs, there's sort of like a four-step process that works well when it comes to implementing AI. And that is: **Plan, Delegate, Assess, and then Compound** what works.

When we spoke to the engineers in this particular org, we found that they were actually really effective at the delegating, at the assessment, and even the compounding. But there was no planning phase. And so they weren't going very far. They were running into the same sort of challenges over and over again because there wasn't a good plan for them to really scaffold significant workarounds. So they could solve a lot of small issues, but they weren't able to address these big sort of meatier problems that we hope for AI to help with.

This is the kind of thing that only by understanding how that particular group of engineers was using AI could we really realize like, you're just missing the planning phase. We just need to do enablement around what good planning looks like. And we're already seeing that, as I think we all know, it makes a huge difference. You can only really compound as much as you plan. So now that they're starting to compound these big plans that are developing significant work, I think we're starting to get that sort of high-leverage machine that we hope to see work in engineering orgs.

**Dan Shipper:** What do we think is possible here? Like what are the kinds of speedups that we expect in engineering in particular?

**Natalia:** You know, that's a difficult question to answer. But I would say we're consistently seeing, when this Plan-Delegate-Assess-Compound framework is in place and used well, we're frequently seeing engineers generate two weeks of work effectively in an afternoon. And I wouldn't be surprised if that continues to speed up.

**Dan Shipper:** Yeah, I mean we see that too. It definitely changes how we think about who we can hire on the technical side and what we are optimizing for, and even how we do programming interviews. But I think one of the more interesting ones is watching you and several other people who are not technical inside the org just get your mind totally blown over the last three or four weeks. It feels like there's been this massive phase shift where I would just message you and you'd be like, "Yeah, I've been up since 6 a.m. vibe coding."

Can you tell us about that? Because I think it's really interesting and I think if I had to guess, you're sort of the leading edge of the spear. There's going to be a lot of people coming after you that are feeling the same way.

**Natalia:** So yes, I will admit that I am a bona fide vibe code addict at this point. The way this happened is a funny thing. I actually realized I was starting to fall into a trap that I often see our clients fall into. At the end of last year, we had so many projects going on, we were supporting hundreds of people across organizations. Every day my day would start and I just had a bunch of meetings and a bunch of work to do, so I didn't really have time to play with a lot of these tools.

Going into this year, we realized with Natash Agarwal, who is our Applied AI Engineer on the consulting team, that we weren't going to move as fast and do the creative work that we wanted if we were scheduling the work to happen in the 9-to-5. So we decided to start our day three hours early. So we would meet at 6:00 a.m. and we would basically just vibe code from like 6:00 to 9:00 a.m.

It all started with us asking, could we create this really ambitious project? Project management is really time-consuming for any consulting business. It's a real skill, but it requires understanding a lot of moving pieces—how clients prefer information, how they are scheduling sessions, all of the nuanced things happening for any given project. And Natash and I asked, "Do we think we could really spin up an agent, hire an agent to be our project manager?"

The answer really quickly was yes, but also the framework for how to do that effectively—this is in Claude Code specifically—actually took a lot of iteration. I would say we got 85% of the way there three times and then had to scrap it given what we learned, and then start again to get to a new framework that actually got us to 100%.

It's just been so fun. It's so cool to really build something. It's really creative work and it's clarifying work to think about the questions: What does it mean to be a good project manager? What does it mean to be a good project manager *for me* in the business that we're running? And how do I codify this into a series of instructions?

We talk about using AI effectively being a lot about being a good manager. How can I be a clear communicator and provide clear instructions so that we can really create this agent—we call Claudie—to really run on their own and do this work for us? And it's just so cool to be a few weeks out from that and to really have this system working.

**Dan Shipper:** That's really cool. I want you to show us the system. Before we get there, I want to point out that interesting pattern which is instead of just expecting it to happen inside your 9-to-5, you actually just carved out three hours outside of your job to play. That's an interesting lesson. We just got back from Think Week in Panama, and the whole point was just to get rid of all of our day-to-day work and just play around with new technology.

What you don't want to do is work really hard to be the fastest horse and buggy driver. You can't learn to drive a car until you take some time out of your horse and buggy race to be like, "What is this car thing?"

**Natalia:** It's really hard actually having that creative space. It is very counterintuitive to the way that we usually work. Usually, when you're hired to do a job, you're hired to do a specific set of functions. For a company to be so bold as to say, "Hey, we think this is all changing and we don't know exactly how it's changing, but we trust that you can figure it out," is really revolutionary.

We had to throw our project manager agent away three times before we found this scaffolding that really works and that saves us so much time per week. But I'm not an engineer, I'm not a product manager. This isn't my day-to-day job. This is only exciting and possible when you put on this creative hat and just keep on tinkering until you find something that really works. And for me, having Natash, having you, having everyone on the Every team around me where I'm seeing constantly what's possible, it just makes all of these things so much more achievable.

**Dan Shipper:** Yeah, I think that's another really good pattern. You have Natash who's an applied AI engineer who can literally sit with you and help you figure out, "Okay, given my workflow, how can I build this project manager?" You have the expertise in what's needed and he has the expertise in what's at the edge of technology.

**Natalia:** Yeah absolutely. I'll also say I think there's something to be said about you need as much engineering power and AI know-how as you need an understanding of what "good" looks like. The different iterations of our agent that didn't work... one was just too engineering-focused. It was too focused on the framework and the strategy of how the data would be connected. The other one was too focused on just what the work is, right? So it was just kind of like a job description.

It wasn't until we realized it's a mix of the know-how of what good project management looks like to us, and then also how tasks and agents and sub-agents and all of this Claude Code infrastructure can best be organized so that it serves the need that we're specifically looking to solve.

**Dan Shipper:** Makes sense. Can you want to show us a little bit of Claudie?

**Natalia:** Yeah, let's do it. Can you see my screen?

**Dan Shipper:** I can see your screen.

**Natalia:** All right, so welcome to the Every Consulting GitHub page. This is where Claudie lives. Claudie is our project manager for the consulting work that we do with our clients.

The first thing that I'll show you is the architecture. At the highest level, we have this `Claude.md` file that has the instructions, the context—basically the job description that Claudie has. Then we have a list of commands that basically run Claude. So if we want to do a quality check on the data that is collected, if we want a weekly update on what's going on across clients, if we're trying to set up a new client.

Then we have a list of tasks. Tasks came out fairly recently and they have been instrumental to Claudie being effective because they manage dependencies and enable sub-agents to basically double-check and triple-check the quality of the work that's being done before it comes back to us.

And then we have some general-purpose skills files, general principles (we want things to be well formatted, etc.). And then this is kind of maybe the most important part: the data sources. We enabled MCPs that connect to Gmail, to Calendar, to Google Drive, and then to the meeting transcripts for the work that we do.

So at the highest level, this is the architecture of Claudie. If you're watching this and you need a project manager, this is a pretty good template.

I'm actually going to now dive into the `Claude.md` file. This is the job description that we've given Claudie. This is a file that Claudie reads every single time we ask her to do something. We found this to be really important because if you are a project manager, you always know where you work, what your job is, what it means to do a good job, who you report to, and who your colleagues are. So we wanted to create a file that at its baseline always gave Claudie this information.

It knows who we work with, it knows where to draw data from. We also have some ID conventions—principles of database management that actually help a lot in project management where you are relating different pieces of information to each other. "Did this person attend this training session?" So creating ID conventions that allow Claudie to connect who did what, where, were a huge unlock.

And then we gave Claudie some principles to always keep in mind: Data accuracy is key, be proactive not reactive, every interaction builds or erodes trust, formulas over manual entry, and when in doubt, escalate.

**Dan Shipper:** This is so cool. I want to see how it works in action. Maybe how it works to set up a new client?

**Natalia:** Yes. So let me take you... I'll create a new Warp page here. We're going to open Claude. Living dangerously, skipped permissions, love it.

So we are in Warp and I've just opened Claude. If you go to our plugins, you'll see that we have all of our plugins connected here. This actually lives in the workflow plugins. So what we do is we go to Claude and let's say we're onboarding a new client. So we would say "new client setup" and I'm going to pretend like I'm onboarding one of my favorite clients, Headway.

It loads the skill so now it knows what it's doing and it's going to read information as required by the handbook. Now often with AI, we think that things are going to be instantaneous, but for anything to be actually useful it just takes time. We're probably going to see Claudie work for a while. Last time we set up a client, I think Claudie worked for about 30 minutes.

What you'll see here is that we've instructed Claudie to do a lot of work in gathering information first. So here the first phases of her work are looking through my Gmail, looking through my calendar, looking through the Drive, looking through call transcripts just to establish a foundational set of truths before it goes and then starts populating information into a dashboard.

**Dan Shipper:** This is so cool. It's like, okay, you just launched four sub-agents to look through your Gmail, calendar, Drive, meetings to get context on the project. That is crazy that that's possible. And then it's going to go and gather that information and put it in the right place into the spreadsheets that you use to run the business.

**Natalia:** That's right. I mean the only thing that's crazier is that the alternative to Claudie doing this is me doing this.

**Dan Shipper:** So what do you do with all your time now, Natalia?

**Natalia:** Work with more clients, Dan, of course.

**Dan Shipper:** I think that's actually really interesting because one of the most important things about doing change management inside big companies is this feeling that "Okay, if I do something like this... what am I going to do?" That's where a lot of the resistance comes from.

**Natalia:** There's two truths to that that are maybe non-obvious. One is you are still managing something. Anytime Claudie inevitably makes a mistake or lacks sufficient information, I have to go back and give it context. This is the same way that you would build a relationship with any new staff member. You're really building and cementing that relationship and investing in it.

The second thing is this is exactly where AI shines. My favorite thing about any of the work that I've ever done has been working with people. Any hour that I am not spending tabulating information, I am spending with the people that I get to work with, and that is so much more fun and so much more valuable.

All right, so let's see. This is a little bit of a dummy dashboard that we've set up for this demo, but this is effectively the structure of the output that we would get. So here we have the total number of sessions that we might work to deliver with this client, the deliverables, any open items—tracked again across email, granola notes, or notion meeting notes.

We have the people... every person has an ID and a title and a team ID so we actually know how they map to each other. We have a team summary... how many people are part of a given team, how many sessions they've participated in. Once we've delivered say a training session, we have a session ID and we know what team participated, what people participated, what we covered, where it was delivered, who delivered it, and how many people attended. This is information that's really important to track over time so that we know really what we've done, and it's really quite tedious to catalog this manually. Now it's just populated automatically.

Same for deliverables, source materials, feedback tabs... So all of a sudden we're going from a working relationship where I am looking for this information in my Drive and populating this dashboard manually, to I just open this Drive, I ask Claudie to update the dashboard based on what's happened in the past week, and it proactively tells me how we're doing with any given client.

**Dan Shipper:** Absolutely incredible. And how long would this normally take you?

**Natalia:** On any given week I spend at least 10 to 15 hours on just project management. Now with Claudie, I am collecting information for an hour a week.

**Dan Shipper:** That's incredible. Natalia, this is so impressive. The work that you've done in the last year has been incredible. If people are interested in following you or getting in touch with Every Consulting, where can they find us?

**Natalia:** They could find us on the Every site, so we are at every.to/consulting.

**Dan Shipper:** Awesome. Nice talking to you.

**Natalia:** Thanks Dan.

---

## Notable Timestamps

* 00:00 - Introduction to "Claudie," the AI Project Manager
* 00:53 - Dan welcomes Natalia (Head of Consulting)
* 02:40 - Lessons from 100+ companies on AI adoption: Top-down vs. Bottom-up
* 08:00 - Case study: Private Equity firm and "Savile Row" prompting
* 16:20 - The "Plan, Delegate, Assess, Compound" framework for engineering
* 19:50 - "Vibe Code": Waking up at 6am to code an AI project manager
* 30:00 - Demo: The architecture of Claudie (Tasks, Skills, MCPs)
* 32:40 - The `Claude.md` file (The AI's job description)
* 36:15 - Live Demo: Setting up a new client using the AI agent
* 42:00 - Walkthrough of the automated Project Management Dashboard
* 44:40 - Results: Reducing 15 hours of weekly work to 1 hour