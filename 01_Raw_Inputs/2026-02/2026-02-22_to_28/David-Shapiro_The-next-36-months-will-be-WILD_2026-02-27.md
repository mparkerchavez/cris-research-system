# The next 36 months will be WILD

## Metadata

* **Channel:** David Shapiro
* **Published:** 2026-02-26
* **Duration:** 32:37
* **URL:** https://youtu.be/zeHTTXAWDUA?si=6KLyFMICHm7TiHoo
* **Transcript Extracted:** 2026-02-27

---

## Transcript

**David Shapiro:** Why does it seem like all of a sudden everyone is talking about AGI and ASI and recursive self-improvement (or RSI) in the 2027 to 2028 window? Sam Altman, Jensen Huang, and a few others like Dario Amodei are all seemingly consolidating or converging around this number. So let's unpack it and figure out why.

First and foremost, we need to set the stage: who has said this and what is their time frame? Please forgive the error bars—the error bars are not exactly right, but you get the idea. Anthropic or Dario Amodei has said that powerful AI matching Nobel-level capability, "a country of geniuses in a data center" (if you've ever heard that, it comes from Dario Amodei), will arrive around 2027 or 2028. Then there's the AI 2027 report. This was from some of the safety guides like Daniel Kokotajlo. Their modal prediction for AGI was 2027 to 2028. The window has collapsed from decades to months. The error bars are much smaller than they used to be. Jensen Huang said AGI competitive on broad human tests within 5 years. I think he's sandbagging; I think he's being a little bit cautious. Sam Altman said "research intern by 2026," which the entire internet basically agrees on. Across Twitter and all kinds of domains and disciplines, advanced mathematicians and economists are saying these reasoning models are now good enough to replace some of their helpers. And then super intelligence by 2028. This is what they are objectively saying. This is not me, this is them.

They've talked about AGI, ASI, and recursive self-improvement. The recursive self-improvement is actually generally earlier. People are saying this year sometime or 2027 at the latest to have fully realized recursive self-improvement. One of the most powerful signals for this is the METR eval. If you've followed me for a while, you know that I've been talking about this. I was trying to model it last year because the exponential model didn't fit, and what I determined is that it's actually a super exponential model. If you have a logarithmic scale, it is still curving up exponentially.

The latest piece of data that ricocheted across the internet was when Claude Opus 4.6 jumped to a median autonomous success rate of 14.5 hours, with the 95th percentile up to possibly 90-plus hours. If you go look at the original raw data, it's pretty impressive. That really woke people up because 96 hours is like 4 days. That's as of February 2026, and we're doubling every four to seven months, but the doubling is also shortening. If the trend continues, we're going to be doubling every 90 to 100 days around now. 90 days is one quarter, and we're not even through the first quarter of 2026, meaning we could have three more doublings of machine autonomy in this year alone. If you double from 14.5 hours, that goes to 29 hours. Double again, that's almost 60 hours. Double again, that's 120 hours—about a week. We're approaching 60 to 120 hours of machine autonomy being realizable just by the end of this year at the current rates.

When we talk about recursive self-improvement, there are five specific things that we expect to see. Number one is algorithmic research or math: developing new architectures, algorithms, and theories. This has been one of the big ones. Last year, when two labs got gold on the IMO (International Math Olympiad), they started tackling harder problems. I don't think anyone has even remotely tried to tackle a Millennium Prize yet, but you don't need to solve a Millennium Prize to advance artificial intelligence. None of the human world leaders in AI, like Andrej Karpathy or Ilya Sutskever, have solved a Millennium Prize. Somewhere between gold-medal performance on the IMO and solving Millennium Prizes is where we're at right now, and that's what's needed for algorithmic research.

Next is data generation and data curation. This is an entire discipline. All the latest models are trained on somewhere between 10 and 20% synthetic data. The number one problem with training on synthetic data is model collapse. It's not clear if we have solved that, but it does seem like more labs are working on generating more synthetic data through self-play algorithms, in the same way that AlphaGo and AlphaFold have been trained. You can generate an infinite amount of text, and once you have a way of validating that that text is useful, you can use it. One strategy they used to train the reasoning models is basically generating a thousand reasoning traces and picking the best few. There are also practices where models grade each other to generate more synthetic data. Additionally, human brains learn to do more with far less data. We're exposed to a tiny fraction of the amount of data that large language models are, so we're not even near the ceiling of what maximum possible data efficiency is.

Next is writing and executing code. This is what the entire world is freaking out about right now. Models like Claude Code and Codex are better than most developers now, and a lot of developers are having existential anxiety over what the point of their computer science degree was. This is basically solved. I'm not going to say it's perfect; it still mangles code bases sometimes. But remember, this time last year everyone literally laughed when Dario Amodei said by the summertime AI is going to write most of our code. He was only off by a few months because the latest version of Claude was literally written by Claude. We're one or two more 90-day cycles before coding is beyond the threshold required for recursive self-improvement.

Next is actually training the models—putting together the run and scheduling it on compute. This is more of an infrastructure job where you define the dataset, parameters, hyperparameters, and model architecture, and hit go. This is still one of the most expensive things these labs do, burning millions of dollars on compute cycles for weeks at a time. Once you define your algorithms and loss functions, there's no reason AI couldn't hypothetically do that, as it's all just code and API calls. I haven't heard of anyone doing fully autonomous agent-driven model training runs yet, however.

Finally, model evals. You have to know if a model is actually better or worse than the current generation. Model evals require a tremendous amount of work and human grading, especially for things that aren't provably correct like executing code or calculating math. We do know many labs use AI to help with evaluations, but it has also been proven that it is difficult, if not impossible, to have a dumber model accurately grade a smarter model. These last two steps—training execution and evals—are the biggest bottlenecks right now.

One of the terms that has been bandied about lately is the "industrial siege." This is the AI race and the point of no return. First, you have race dynamics. Companies and nations are racing. I coined the term "terminal race condition," where the state we're heading towards is maximally intelligent and efficient AI, because no company is incentivized to slow down. Nations are also competing, mainly America and China, and Europe is starting to deregulate to catch up. The point of no return is the sunk cost fallacy, or the "Hail Mary." Companies are already in for $600 billion on data centers, chips, and infrastructure. If they back down now, they might as well shut the company down. This creates an all-in, win-or-lose, maximum speed forward dynamic. Pausing is fatal.

What are the bottlenecks? The chip problem has completely been solved. High Bandwidth Memory (HBM) is the next bottleneck. Desktop memory is becoming more expensive because foundries are prioritizing the more valuable HBM over desktop or laptop memory. The market is pivoting hard with over $100 billion of investment across companies like SK Hynix and Samsung, and this is expected to be solved in the next 12 to 24 months.

Energy is the next big bottleneck, and it's much harder to solve. The goal is to get to 500 terawatt-hours of AI power demand. To put that in perspective, total annual energy consumption in America is over 4,000 terawatt-hours. Getting to 500 terawatt-hours is about 12% of our current footprint, which is massive. Data centers are building solar micro-grids, collocating with natural gas, or building natural gas turbines on site to bypass grid constraints. Traditional nuclear takes too long, and Small Modular Reactors (SMRs) aren't expected until 2028 or 2030 at the earliest. We are seeing bipartisan anti-data center sentiment rising, which is strange because data centers don't produce extra local carbon unless burning natural gas, which is still cleaner than coal.

There's a concept from linguistics called the Sapir-Whorf hypothesis, which basically says language constructs reality. People have reified the term "AGI" through science fiction and imagination, waiting for a specific "brain wave" to occur to recognize it, looking for consciousness or a soul. But the reality is, when you look at the abilities of these machines going up exponentially in remote work, long-horizon tasks, and economic substitution, it doesn't matter what you call it. The real measurement is impact, and we are already seeing economic impact and job dislocation. By 2028, expect autonomous week-long engineering tasks, multi-agent swarms, persistent recursive memory, and tool fluency (using computers indistinguishably from humans).

We are seeing Solow's Paradox 2.0. In the 80s, you saw computers everywhere except in the business productivity statistics. Today, you see AI everywhere except in employment statistics. However, as of 2025, we had 3.7% GDP growth with only 180,000 jobs added. We are starting to see the GDP ramp up from AI. Companies make more money with lower headcount. We are entering the "harvest" phase of the J-curve of productivity, where labor decouples. The "automation cliff" isn't just mass firing; it's the "vanishing ladder" or ghost jobs—positions that are never created in the first place, leading to entry-level hiring freezes and highly qualified grads unable to get jobs. This is a long-term secular regime of jobless growth.

Right now, AI is in the augmentation phase. It's experimental and optional. But once it becomes reliable and easy to deploy, you go from zero to one very quickly and hit the automation cliff. It becomes viral and mandatory. I built my career on virtualization when it wasn't obvious, and I pivoted to AI in 2022 because it's obviously the future. We are heading for an automation cliff as AI becomes better, faster, cheaper, and safer than humans.

When we talk about risk, there are four quadrants based on impact and predictability. High-impact, low-predictability risks are the "zone of unknown": societal outcome, government capture, financial collapse, or existential risk. Low-impact, low-predictability risks are alignment bugs and agentic failure modes, which can be patched. High-impact, high-predictability risks are the scaling laws—model capabilities and compute growth. Low-impact, high-predictability factors are business-as-usual stuff like market forces, energy, and memory bottlenecks, which the market will solve.

Leading indicators to watch: METR scores crossing the 24-hour autonomous horizon (likely in 90 to 180 days). High bandwidth memory fading from the news as it gets solved. Capex crossing the trillion dollars per year threshold. And entry-level hiring continuing to implode.

Finally, experts fall into four groups based on how significant they think AI will be and whether the outcome will be good or bad.

1. **Doomers:** High significance, bad outcome (e.g., Eliezer Yudkowsky, focusing on existential risk and the control problem).
2. **Accelerationists (Benign/Optimistic):** High significance, good outcome (This is my group. We believe it will solve major problems with a relatively smooth transition, though the job shock might be fast).
3. **Techno-skeptics:** Low significance (e.g., Gary Marcus, Yann LeCun, claiming AI is overhyped).
4. **Realistic Engineering Concerns:** Significant, but requires slowing down for safety (e.g., Geoffrey Hinton, Yoshua Bengio, focusing on reliability and bugs).

That is the state of things with AGI and ASI, and what to expect from the experts over the next 2 to 3 years. Peace, I'm out of here.

---

## Notable Timestamps

* 00:00 - Introduction to AGI/ASI timelines (2027-2028 predictions)
* 01:50 - Recursive self-improvement and METR evaluations
* 04:06 - The 5 requirements for recursive self-improvement
* 10:35 - The "Industrial Siege", AI race dynamics, and sunk cost fallacy
* 13:25 - Hardware and energy bottlenecks (HBM, power grid, nuclear)
* 18:55 - The Sapir-Whorf hypothesis and measuring AGI by economic impact
* 22:20 - Solow's Paradox 2.0, the automation cliff, and the "vanishing ladder" of ghost jobs
* 27:05 - The AI Risk Matrix (Impact vs. Predictability)
* 29:20 - Leading indicators to watch in the coming months
* 30:35 - The four groups of AI perspectives (Doomers, Accelerationists, Skeptics, Safety Engineers)