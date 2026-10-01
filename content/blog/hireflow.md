---
title: "HireFlow: keeping the hiring workflow clear"
description: "A position board, candidate context, and traceable team decisions in a compact private application."
date: "2026-10-01"
tags: ["SvelteKit", "TypeScript", "SQLite", "Product Engineering"]
published: true
slug: "hireflow"
---

HireFlow is a hiring workflow application I built to track open positions and the people a team is trying to hire. It complements an HR system by giving hiring managers a shared view of interviews, notes, and progress.

Each position has a board. A candidate moves through its interview stages while their notes and activity history remain attached to their profile. Transfers preserve the history rather than starting a second disconnected record.

The app supports the work around a decision. It does not rank candidates, recommend whom to hire, or automatically reject anyone.

## Try the demo

The portfolio demo uses fictional candidates. You can open a profile, change its stage, add a fictional note, and inspect the activity timeline. Changes stay in the current browser tab and disappear on refresh.

[Explore the synthetic HireFlow demo](https://hireflow-demo-theta.vercel.app). The deployment currently requires Vercel authentication; public portfolio access is pending.

This is a standalone demonstration of selected workflows. It does not connect to the private application or accept uploads.

## The full application

The private app uses SvelteKit and TypeScript, with SQLite through Drizzle for persistence. A Docker Compose stack provides its identity proxy, private edge, and attachment scanning. Important mutations record the actor and time, and REST clients use revocable API tokens stored as digests.

The repository's current readiness assessment approves a private synthetic-data demo. Real candidate data remains blocked pending the identity, recovery, host-restart, rotation, and security checks documented in the project.
