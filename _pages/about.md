---
permalink: /
title: "About"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

I'm currently a Ph.D. candidate at the [University of Maryland, College Park](https://ischool.umd.edu/) (UMD), and a member of the [Human-Computer Interaction Lab (HCIL)](https://hcil.umd.edu/). I'm currently advised by [Dr. Stephanie Valencia^2](https://stephanie-valencia.com/), where I research and build AI-powered computer-mediated communication technology for people with aphasia[^1].

[^1]: Language impairment that affect's a person's ability to understand and produce language, usually caused by damage to the language portion in the brain.

My work encompasses HCI research methods, software development, and computational approaches to analyzing and modeling user behavior. I currently work in the intersection of computing accessibility and Human-AI Interaction, where my doctoral research focuses on the development of user-programmable AI workflows to support communication for people with language disabilities. 

I was fortunate to have worked with [Dr. Eun Kyoung Choe](https://terpconnect.umd.edu/~choe/) and [Dr. Ivan Lee](https://groups.cs.umass.edu/ahha/team/) in examining how self-tracking tools can support goal-setting in stroke rehabilitation. I've also worked with [Dr. Daniel Epstein](https://depstein.net/) and the members of the [Personal Informatics Everyday (PIE) lab](https://depstein.net/pielab) at UC Irvine on various self-tracking technology research.

I completed my M.S. in Computer Science at the [University of California, Irvine](https://cs.ics.uci.edu/), and B.S., in Computer Science and Engineering at [Chung-Ang University](https://neweng.cau.ac.kr/index.do), Seoul, South Korea.

## News

{% assign news_items = site.data.news | sort: 'date' | reverse %}
{% if news_items and news_items.size > 0 %}
<ul>
{% for item in news_items limit: 5 %}
  <li>
    <span>{{ item.date | date: "%b %-d, %Y" }}</span> —
    {% if item.link %}<a href="{{ item.link | relative_url }}">{{ item.title }}</a>{% else %}{{ item.title }}{% endif %}
    {% if item.description %} <br> <span style="font-size: 0.8em;">{{ item.description }}</span>{% endif %}
  </li>
{% endfor %}
</ul>
{% endif %}
