# How to install and use Claude Code Agent Teams (Reverse-engineered)

## Metadata

* **Channel:** AI Jason
* **Published:** 2026-02-07
* **Duration:** 09:39
* **URL:** [https://youtu.be/S2WTTMXYcYY?si=RbvWBw1oBgmUVWJa](https://youtu.be/S2WTTMXYcYY?si=RbvWBw1oBgmUVWJa)
* **Transcript Extracted:** February 7, 2026

---

## Transcript

**AI Jason:** Claude Code just had a massive upgrade of the "Agent Teams" feature, which is different from the task and sub-agent feature we had before. This time, it can spin up three to five different Claude Code instances to collaboratively complete a task and project, and each Claude Code session here can communicate with each other with different communication protocol methods.

I spent a bit of time looking into the actual logs of the larger model call from the new Agent Teams feature to understand how it actually works compared with the previous sub-agent. Now I think I finally have a good grasp. I'm going to take you through how exactly Agent Teams works, how each agent shares context with each other, and how they communicate step by step.

But firstly, let's talk about how do you actually install and use Agent Teams. To use Claude Code Agent Teams, firstly make sure you update your Claude Code to the latest version, which is 2.1.34. Then you want to set the environment key `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` to be `1` in `settings.json`. You can just do `code ~/.claude/config/settings.json`. This should open up your `settings.json` file at the global level. You can insert this ENV key here: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` to be `1` and save it.

Then, making sure you're adding a new Claude Code session. Now if you're prompted with something that mentions that you should create Agent Teams to do certain tasks, it will start setting up different teammates and then create a task list and trigger different Claude Code sessions for each task below. You will see those different agent sessions start showing up. You can hit enter on each one to see what it is doing. Looking at the log, you will see that for each Agent Team, it will be given a prompt about the task itself. You can talk to each individual team member if you want to give specific instructions. Once finished, it will shut down the teammates, basically closing off each Claude Code session, and go back to the main session.

But to best use Agent Teams, you want a tmux-type of terminal experience where you just bring up different sessions so you can see what each agent is doing live. To do that, the easiest way is you will download tmux, or if you're on Mac, you can download iTerm2 which is a more advanced terminal app. You need to go to **Settings > General** and turn on the Python API option. Once you did that, just close iTerm2 and restart. For the new session, you can run `claude-teammate-dash-mode`. This opens Claude Code with Agent Teams function in split view. As the Team Lead agent sets up new agent team members, you will see new session windows just popping up on the other side so you can see clearly what each agent is doing. Just clicking inside the session sends a new message if you want. So this is the best way I found to use the Agent Teams.

But the more important part is that we actually want to deeply understand how does this Agent Team work so that we can decide when to use this Agent Team method versus the sub-agent. Here I did a whole back-and-forth investigation to understand all the new tools that Claude Code is having now and how the communication happens between different agents. Let me break it down for you.

One of the key changes is that before Agent Teams, Claude basically had this one tool called "Task Tool" that can spin up a sub-agent to do certain things, and once the sub-agent finished, the session just terminated and only the summary response will be sent back to the main agent. This is how it works. But with Agent Teams, it is going through a much more complicated process with a list of new tools that the agent has.

Firstly, the agent will call this new tool called `TeamCreate`. Basically, the main agent can call this `TeamCreate` tool which will create new Agent Teams under your `.claude/teams` folder. This will create a config file including some basic information about the team. At this point, the team member array is still empty. There's also one configuration called `agent_type` which allows the main agent to define who the team lead is. At the moment it's not entirely clear why they have this one; I assume it's for some future features that they might add. But this is the first step of `TeamCreate`.

The second step is creating a list of tasks. So this is different from the task tool which will spin up new agents. `TaskCreate` tool is to log all the to-dos for the teams which will be added to `.claude/task` folder as well, where each task will have its own JSON file to lock the status. You can see for each one it will include things like subject, description, status, and blocked-by. This will later be used to identify the dependencies so the agent knows when to pick up which tasks.

Once this task list is created, that's where it will run the actual `TaskTool`. So this `TaskTool` is the same `TaskTool` as what we have before for spinning up a sub-agent, except it is getting some upgrades. So `TaskTool` now has two new entities: `team_name` will be used to identify which team it is, and `name` is the actual team member name. Once those are run, instead of spinning up a new sub-agent, it will actually create a new Claude Code session where each Claude Code session will inherit the team information, the Team ID, as well as a task list so it can autonomously complete, update, or even create new tasks.

Typically, for each new Claude instance, it is supposed to use `TaskUpdate` tool to update the status of the task which looks something like this: it has `task_id`, the status (which can be `pending`, `in_progress`, `complete`, or `deleted`), the owner will be default this sub-teammate, and if they want they can add this dependency information to add blocks and add blocked-by.

They can continue this task until they feel like they need to send a message. This `SendMessage` tool will allow the sub-teammates to communicate back with Team Leads (which is the main agent that coordinates the work) but also it can talk to any other teammates. So this `SendMessage` tool has a few methods. One is a `message` which sends a one-on-one message to any other agent. Or it can `broadcast`, which means it can send the same message to every single agent. But for the sub-agent, most likely it will use these two methods.

But for the main Team Lead agent, which is the agent that we are talking to and orchestrates the whole Agent Teams, it will also have this `ShutdownRequest` method to a specific agent. This is a way how the Team Leads close or terminate sub-teammate sessions. So from what I understand, the Team Lead will send a shutdown request to the sub-teammate, and after that request, it can send back a shutdown response to the main agent which will automatically terminate this sub-teammate session. In the end, the main agent will call this `TeamDelete` tool to actually shut down the whole team.

The message communication protocol between different agents is basically injecting new user messages to each other's conversation history. So in the `teams` folder, there's an `inbox` folder that is maintaining the inbox for every single agent teammate, and it has a read status which probably is used to identify whether the message has been sent to the sub-teammates yet. And for the agent who received the message, the new user message will be sent to this agent with this `teammate_message` tag including the full message information. Based on the information, it can decide what to do next.

Here I'm using Langfuse to actually track what exactly goes into each agent model call. For my Claude Code, I was using Claude Trace for this which normally gives me really in-depth tracking of Claude Code system prompt tools it has access to and everything, but unfortunately that no longer works with the latest Claude Code. But Langfuse does this Claude Code integration that you can use. Basically, it is utilizing Claude Code's stop hook to automatically sync data with Langfuse after each time Claude Code finishes the session. It is not as good as Claude Trace but still gives me good visibility about what is actually going on for each request.

So this is how Agent Teams work. There's a lot of room for imagination with this new setup because they allow them to share context between each other on-demand as well as a shared list of tasks. I'm pretty curious to see what kind of use cases people come up with that actually utilize this capability to send messages to each other as well as let each sub-teammate update new tasks as they go.

Here's one pretty interesting example for debugging. Because quite often when you just use one sub-agent, it tends to find one plausible explanation and stop looking. But for some more trickier situations, it is actually useful to have multiple agents explore different directions and critique, share findings with each other to conclude what is the most possible matter.

Here I just tried with the Super Design production codebase that we have and this one bug that has been hidden pretty deep. They can tell the agent to spin up five agent teammates to investigate different hypotheses, have them talk to each other and try to disprove each other's theory like a scientific debate, and update the findings doc with whatever consensus emerges. So here you will see that the main agent first creates the task list as we discussed before, and then for each task it spins up a new Claude Code session on the fly where each one is investigating a different direction. You can see this time sub-agents were sometimes using `broadcast` to send their findings to all the other agents, debate with each other, and in the end, each one sent their final verdict back to the main agent.

Meanwhile, sometimes they will also use this `WriteMemory` tool which is quite interesting. If I open it, it seems to write a kind of documentation about the consensus findings from each agent. In the end, it comes back with a complete picture which is a lot more in-depth than you will get from just one sub-agent. This is just one quick example of what potential new use cases can be unlocked with this new Agent Team structure compared with the previous simple sub-agent setup.

As I mentioned, I'm really keen to see what kind of use cases people are going to come up with for this new setup. Comment below, let me know any interesting findings you have. Meanwhile, if you want to dive deeper, you can join AI Builder Club which is a community of top AI builders who are building and launching AI products. There are learning resources and weekly workshops where we dive deep into building agents and AI coding workflows. I also put a link below so you can join if you're interested. I hope you enjoyed this. Thank you and I see you next time.

---

## Notable Timestamps

* 00:00 - Introduction to Claude Code Agent Teams upgrade
* 00:41 - Installation instructions (`settings.json` configuration)
* 01:46 - Using tmux or iTerm2 for split-view visualization
* 02:35 - Reverse-engineering the Agent Teams architecture
* 03:13 - Step 1: `TeamCreate` tool explanation
* 03:43 - Step 2: `TaskCreate` tool and task management
* 04:12 - Step 3: `TaskTool` and spinning up sessions
* 05:13 - Communication tools (`SendMessage`, `broadcast`)
* 06:13 - Message protocol (inbox folder injection)
* 06:41 - Tracking agent calls with Langfuse
* 07:40 - Use Case Example: Collaborative Debugging / Scientific Debate
* 09:20 - Conclusion and AI Builder Club info