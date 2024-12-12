---
layout: archive
title: "Tinkering"
permalink: /tinkering/
author_profile: true
---

{% include base_path %}

Here's a collection of various small projects and tidbits that I worked on in the past.

{% assign sorted = site.tinkering | sort: 'number' %}
{% for post in sorted %}
  {% include archive-single.html %}
{% endfor %}

