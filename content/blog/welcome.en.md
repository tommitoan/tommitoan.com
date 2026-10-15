---
title: Hello: what this site is for
date: 2026-10-15
description: A few lines about the Feng Shui corner of tommitoan.com, about Bazica, and why a chart here changes year at Lichun.
---

I'm Toan, a software engineer who writes Go. Outside work I spend a lot of time on Ba-zi: learning the background, then turning it into code other people can use.

## What Bazica is

Bazica is an open-source Go library that calculates Ba-zi charts. [Bazica Web](https://bazi.tommitoan.com/chart) is the website on top of it: enter a birth date and time, a time zone and a gender, and you see the four pillars, the luck pillars and each year.

The site's server only checks what you enter and calls the library. Every Ba-zi calculation lives in the library, so it can be read, checked and reused elsewhere.

## A few things to know when you read a chart

- **The Ba-zi year changes at Lichun**, around 4 February, not on Lunar New Year's day. This site follows that rule. It also shows the Lichun time of the birth year and the lunar-calendar (Tết) year so you can compare.
- **The birth hour is counted in the time zone of the birthplace.** Two hours off changes the whole hour pillar.
- **Birth years from 1700 to 2399 are supported**, as reported by the library.
- **A share link does not send the birth date to the server.** The birth fields sit in the part of the address after `#`, which the browser does not send. Anyone who receives the link can read those fields, so send it to people you trust.

## What will be here

I'll write about how to read a chart, about the places where solar terms are easy to get wrong, and about building a Feng Shui product as software. A post that exists in both Vietnamese and English has a language link at the top.

If you want to try it now, [open Bazica Web](https://bazi.tommitoan.com/chart). The library's source is on [GitHub](https://github.com/tommitoan/bazica).
