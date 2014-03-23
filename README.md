# Solr UI

## What's this?

This is a web application that builds upon the Apache Solr and provides interfaces that can be used easily.

## Motivation

Because I often have a lot of burden to search for documents in my projects,
I decided to develop this app that can  be used easily.
For example

- "After extracting from a zip file, you can immediately start the app. "
- "The App can be configured through web interfaces."

## Development principle

### Model JavaScript and Java code thoroughly.

In my past projects, I often must have coped with a lot of duplicated, procedural dirty codes,
so to prevent the disastrous codes, I want to model the codes and make it more reusable and readable.

### Regard usability as primary goal.

"Ease of use" is the most important goal in this app.

### Discard old inefficient MVC Model2 architecture.

Due to improvement of client computer performance,
old MVC Model2 architecture is no longer efficient in nowadays and should be discarded.
Clients should interact with servers as they need new data or update data.
It dramatically reduces client response time and network traffic.

To achieve the goal, I'm developing own JavaScript PAC pattern framework.

* [simple-pac](https://github.com/zyake/simple-pac)

## bibliography

* [Designing Interfaces](http://shop.oreilly.com/product/0636920000556.do)
* [JavaScript Web Applications](http://shop.oreilly.com/product/0636920018421.do)