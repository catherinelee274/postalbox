# POssible
HackSC 2020

Run our application:

`cd frontend`

`npm run start`


Devpost: [https://devpost.com/software/possible](https://devpost.com/software/possible)

## Developers

Created by [Alex Cui](https://github.com/alexcdot), [Devin Mui](https://github.com/DevinMui), [Catherine Lee](https://github.com/catherinelee274), and [Luis Costa](https://github.com/LuisCGit)

## Inspiration

Coming from the Bay Area, we witnessed countless cases of people living with homelessness. People living with homelessness experience many problems. However, one of the biggest problems people living with homelessness experience is their lack of a permanent address. Social services are a huge part of overcoming the cycle of poverty, however, one can only qualify for these benefits by having a permanent address.

Normally, people living with homelessness would obtain a "permanent address" for these forms by these means (listed in no particular order):

1. PO Box
2. Friend
3. Church
4. Shelter

However, these current solutions might not work for every person living with homelessness. A PO Box can cost anywhere from $14 to $90 depending on the volume of mail received. Friends, churches, and shelters may not want or like to host mail for people for free. These factors can make it much more difficult for these people to take advantage of the resources the government has to offer.

## What it does

POssible makes it possible for homeless people to escape poverty.

## How I built it

We used React.js for our frontend, and blockstack to store our data locally on the browser. We used open-source tensorflow models to run facial recognition and run OCR, and served the data with a Flask server. Finally, we used arduino to control the motors and LEDs that sorted the mail.

## Challenges I ran into

Getting facial recognition to run on GPU hardware locally was very challenging, so we ended up using a server in the cloud. Additionally, getting our backend to run on blockstack was quite confusing, until we realized we could store everything on our local blockstack browser storage.

## What's next for POssible

If you'd like to partner with us to pilot this in a community, please contact us at alex.yy.cui@gmail.com