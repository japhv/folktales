# Folktales
A conversational storyteller skill for Alexa & Google Assistant

## Inspiration
As kids, we grew up listening to folktales and various other bed-time stories. We often used to ask our parents/grandparents to tell us a princess story or a dragon story and they would oblige. We realised that not many get to have this wonderful experience and hence we created this application.

## What it does
It tells you a folktale based on your query. Suppose you want to hear a tale about a princess, you can ask folktales this,

"Tell me a _ princess _ story"

Or if dragons are your fancy ask folktales this, 

"Tell me a _ dragon _ story"

Or if you don't have anything particular in mind just ask,

"Tell me a story"


## How we built it
We build a server-less function on AWS Lambda to serve as the backend for both Alexa and Google Assistant. We used ElasticSearch's full-text query to fetch stories relevant to the user's request. Finally, we used Amazon's DynamoDB to persist user information and to give the user a unique story each time.

## Challenges we ran into
Setting up the AWS with the VPCs and VPC endpoints took up sometime as there was a learning curve. To get the user query was also a roadblock as we had difficulty building the intent schema with AMAZON.LITERAL. 

## What we learned
We learned about AWS services like VPC, Lambda, DynamoDB and of course Alexa Skills Kit & DialogFlow.

## What's next for Folktales
We hope to extend Folktales' capabilities where it will be able to come up with auto generated folktale-like stories.

## Source
All folktales are obtained from the public domain source Multilingual FolkTale Database http://mftd.org