# Higher-or-Lower Premium Card Game *THIS DOCUMENT IS NOT YET COMPLETE*

## Overview

Higher-or-lower is a deceptively simple card game where the player has to decide if the next face-down card (in a sequence of cards) is higher or lower than the current face-up card.

The player places a wager on whether or not they can guess the next card correctly until they either guess all cards correctly, or they lose their wager and have to start again; the game ends when all cards, in a pack, have been played, or the player has used up all of their points.

For this website, the gameplay reflects an amended version of higher-or-lower premium. This offers better odds than just the single wager, with the number of possible winning points increasing dramatically when placing a wager on, and then guessing correctly, the appearance of a specific suit, matching card, a specific card, or a run of cards.

In the UK, higher-or-lower was the basis for the popular 1980s television game show [Play Your Cards Right](https://en.wikipedia.org/wiki/Play_Your_Cards_Right#:~:text=Learn%20about%20the%20British%20television%20game), where contestants answered questions to guess a longer sequence of cards than that typically used in the classic higher-or-lower card game.

### Site Preview

![A preview of the Hi-Lo website at various screen sizes](assets/images/holding-image.jpg)

### Site Link

[live site]: https://dvfrancis.github.io/hi-lo-card-game
The [live site] is hosted by Github Pages.

## Index

1. [Overview](#overview)
    1. [Site Preview](#site-preview)
    2. [Site Link](#site-link)
2. [User Experience Design](#user-experience-design)
    1. [Strategy](#strategy)
        1. [Key Business Goals](#key-business-goals)
        2. [Key User Goals](#key-user-goals)
        3. [User Experience](#user-experience)
        4. [User Expectations](#user-expectations)
        5. [User Stories](#user-stories)
        6. [User Personas](#user-personas)
    2. [Scope](#scope)
        1. [Existing Features](#existing-features)
        2. [Future Features](#future-features)
    3. [Structure](#structure)
        1. [User Flow Diagram](#user-flow-diagram)
        2. [Logic Flowcharts](#logic-flowcharts)
    4. [Skeleton](#skeleton)
        1. [Wireframes](#wireframes)
            1. [Mobile](#mobile)
            2. [Mobile with Expanded Menu](#mobile-with-expanded-menu)
            3. [Tablet](#tablet)
            4. [Desktop](#desktop)
    5. [Surface](#surface)
        1. [Colours](#colours)
        2. [Typography](#typography)
        3. [Media](#media)
        4. [Content](#content)
3. [Testing](#testing)
4. [Deployment](#deployment)
    1. [GitHub Pages](#github-pages)
    2. [Forks](#forks)
    3. [Local Clones](#local-clones)
    4. [Gitpod Workspaces](#gitpod-workspaces)
5. [Credits and References](#credits-and-references)
6. [Technologies Used](#technologies-used)
7. [Acknowledgements](#acknowledgements)

## User Experience Design

### Strategy

#### Key Business Goals

- To attract players to the game and provide a fun experience.
- The value provided to the website owner is from increasing visitor numbers to the website.
- The call to action on the website will be “Play Game”, or similar.

#### Key User Goals

- Users of all ages visit the website as a way to relax and enjoy playing an easy to understand, and exciting, game.

#### User Experience

- Target audience:
    - Any age.
    - Could be a student, employed, or retired.
    - A casual or firm interest in puzzles.
    - Possibly casual or serious gamer(s).
    - Those looking for ways to relax and have fun.
 
#### User Expectations

- The website:
    - functions as expected; for example, buttons are easy to identify, and behave like buttons.
    - is accessible and responsive.
    - is easy to navigate.
    - has an appropriate and appealing visual design that reinforces the purpose of the site.

#### User Stories

##### First time visitor goals
    
- “What is this website about?”
- “How do you play the game?”
- “What are the rules of the game?”
- "What can I win?"
        
##### Returning visitor goals
    
- “How many points do I have from the last time I played?”
- “What other versions of the game are available?”
    
##### Frequent visitor goals
    
- “Where am I ranked among other players who use the website?”

#### User Personas

The website is designed to appeal to all demographics, but the following personas are meant to represent a range of potential users:

- User 1: Male, student, age 18-21.
- User 2: Female, works part-time, mother of young children, age 25-30.
- User 3: Male, works full-time, professional qualification, age 35-55.
- User 4: Female, retired, grandmother, age 60-80.

##### User 1

“As a student, I want something I can play during my journey to university, so that I’m not bored”

###### Acceptance Criteria

- The website is responsive and displays correctly on a mobile device.
- All messages are clearly displayed and easy to read on smaller screens.
- Any audio prompts can be easily muted when on public transport.
    
###### Tasks

- Style a responsive website using Bootstrap, Tailwind, and / or media queries.
- Display any system messages in a larger format.
- Add the ability to disable audio feedback.
    
##### User 2

“As a mother of two, I want an easy, quick game to play while looking after my children.”

###### Acceptance Criteria

- The website is quick to load and saves user progress.
- The length of the game can be amended.
    
###### Tasks

- Ensure the website has excellent load performance on Google Lighthouse.
- Add an option to specify the number of cards used in a game. 

##### User 3

“As a project manager, I want a game that I can play to take my mind off my stressful job”

###### Acceptance Criteria

- Gameplay is streamlined and easy to understand.
- The game offers different experiences to maintain user interest.
    
###### Tasks

- Add an FAQ page that explains the game, its rules, and other playing modes.
- Create additional gameplay modes for the game.

##### User 4

“As a retired schoolteacher, I want a fun game that I can enjoy but also possibly use to teach my grand-children about numbers”

###### Acceptance Criteria

- The game has a visually interesting design with a captivating (but not annoying) soundtrack.
- Cards and scores are displayed clearly and are easy to understand.
    
###### Tasks

- Implement a design that is bright and colourful, with appropriate sound effects and music.
- Display scores clearly on all screen sizes.
- Ensure cards are easy to see and understand.

### Scope

#### Existing Features

- General

    - All pages will be responsive at different screen sizes, and change layout accordingly and appropriately.
    - All screenshots shown in this section were taken from the desktop site, to give the clearest examples possible (apart from the Header section which also shows the header as seen on mobile devices, with a hamburger menu). 

- Browser Icon:

    - A custom HTML favicon will be shown to aid users' identification of the site. It will also appear whenever someone adds the site as a bookmark or favourite.

        ![Website custom favicon](assets/images/holding-image.jpg)

- Header:

    - TBC

        ![Website header](assets/images/holding-image.jpg)

- Footer:

    - At the bottom of each page - it contains the social media icons, and legal information, and allows the user to jump to the social media properties of the podcast.
    - On hover, each social media icon will change colour, and also when clicked. The legal links only change colour on hover:

        ![Website footer](assets/images/holding-image.jpg)    

- Home (index):

    - This is the first page a user sees when they enter the site. It contains all pertinent information regarding the podcast, with links to other pages where required.
    - The home page allows the user to get a good overview of the purpose of the website and gives them glimpses of associated activities.

        ![Website home page](assets/images/holding-image.jpg)

- FAQ:

    - TBC

        ![Website faq page](assets/images/holding-image.jpg)

- Custom 404:
    - A custom 404 error page appears whenever a user attempts to navigate to a non-existent page.
    - After 30 seconds, the page will redirect automatically to the home page.

        ![Website custom 404 error page](assets/images/holding-image.jpg)

#### Future Features

- Add the ability to play the classic version of higher-or-lower.
- Add the ability to play the switch version of higher-or-lower.
- Expand site to include different card games.
- Add ability for users to create an account.
- Allow users to be place real wagers in a currency of their choice.

### Structure

#### User Flow Diagram

This diagram shows how the user may interact with the website during a game; dashed lines indicate optional routes.

![User flow diagram](assets/images/holding-image.jpg)

#### Logic Flowcharts

The following flowchart explains the logic used for the gameplay:

![Hi-Lo Premium](assets/images/hi-lo-premium.png)

### Skeleton

#### Wireframes

The wireframes presented here show my initial ideas:

##### Mobile

###### Home
![Home (index)](assets/images/holding-image.jpg)

###### FAQ
![FAQ](assets/images/holding-image.jpg)

##### Tablet

###### Home
![Home (index)](assets/images/holding-image.jpg)

###### FAQ
![FAQ](assets/images/holding-image.jpg)

##### Desktop

###### Home
![Home (index)](assets/images/holding-image.jpg)

###### FAQ
![FAQ](assets/images/holding-image.jpg)

### Surface

#### Colours

The following colours have been used to add interesting backgrounds to site sections, with white (#FFF) as a contrasting colour, which is also used for all text:

![Website colour scheme](assets/images/holding-image.jpg)

For the the hover and active link states of each social media icon I used:

- TBC
- TBC

The colours used are taken from TBC.

#### Typography

Fonts were chosen from Google Fonts:
  
- TBC
- TBC

#### Media

All images used on the site have been taken from TBC.

#### Content

All page content was initially written by myself, inspired by the sources listed in the credits, and then polished using Copilot in Microsoft Edge.

## Testing

- Please refer to [TESTING.md](TESTING.md) for details.

## Deployment

### GitHub Pages

The site was deployed using GitHub Pages, as follows:

- Navigate to the GitHub repository.
- Click 'Settings'.
- Under 'Code and automation', select 'Pages'.
- On the 'GitHub Pages' section, under 'Build and deployment > Source' select 'Deploy from a branch'.
- Ensure that the 'main' branch has been selected, and then click 'Save'.

![GitHub Pages deployment](assets/images/holding-image.jpg)

### Forks

To copy the repository to your own GitHub account, so you can make changes without affecting the original version, you can fork it:

- Navigate to the GitHub repository.
- Just above the 'About' section, on the right of the page, click the 'Fork' button.

![Fork deployment](assets/images/holding-image.jpg)

### Local Clones

To deploy the project on your own computer you can clone it:

- Navigate to the GitHub repository.
- Click the green '<> Code' button above the list of project files.
- From the 'Local' tab, select either HTTPS, SSH, or GitHub CLI as the method of cloning, and copy the associated link.
- Open the terminal or Bash prompt.
- Navigate to the directory where you want to store the cloned copy.
- At the prompt, type `git clone` and add the string copied earlier.
- Press 'Enter' to create the copy.

![Clone deployment](assets/images/holding-image.jpg)

### Gitpod Workspaces

When using Gitpod, you can click the button below to create a workspace from this repository, which also requires that you [install the Gitpod browser extension](https://www.gitpod.io/docs/configure/user-settings/browser-extension).

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://dvfrancis.github.io/hi-lo-card-game)

## Credits and References

The following references were used for general advice and help in implementing specific functionality on the website:
- [Duckett, J. (2011) HTML & CSS - Design and Build Websites. Indianapolis: John Wiley & Sons, Inc.](https://htmlandcssbook.com/) - general coding advice.
- [Microsoft Edge Copilot](https://www.microsoft.com/en-us/edge/features/copilot) - coding advice, particularly around CSS rules of ingeritance.
- [How to create a copyright symbol](https://blog.hubspot.com/website/html-code-copyright) - creating the copyright symbol in the footer.
- [How to set a favicon in GitHub Pages]( https://stackoverflow.com/questions/35037482/favicon-with-github-pages) - setting a favicon on GitGub Pages.
- [W3 Schools CSS :visited Selector](https://www.w3schools.com/cssref/sel_visited.php) and 
 [CSS-Tricks :visited](https://css-tricks.com/almanac/selectors/v/visited/) - styling the navigation links after they had been visited.
- [Background on semantic HTML5 elements](https://www.freecodecamp.org/news/semantic-html5-elements/) - ordering semantic HTMl elements.
- [Redirect to custom form completion page](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections?ref=library.linkbot.com) - creating a redirect from the website's custom completion pages.
- [How to Implement ARIA Tags for Better Accessibility](https://dev.to/sarveshh/how-to-implement-aria-tags-for-better-accessibility-a-comprehensive-guide-for-web-developers-h3k) - how and where to use ARIA tags.
- [Using Media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) - creating media queries to control ``body`` padding at different screen sizes.
- [Creating a custom 404 page for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site) - implementing a GutHub Pages custom 404 page.
- [How To Change the Color of the Bootstrap 5 Mobile Menu Icon](https://www.youtube.com/watch?v=45QSuJaHEss) - altering the colour of the hamburger menu on mobile devices.
- [How to use srcset and sizes for responsive images](https://stackoverflow.com/questions/35099471/how-to-use-srcset-and-sizes-for-responsive-images) - making the website's image carousels more responsive.
- [The Only Markdown Cheatsheet You Need](https://github.com/im-luka/markdown-cheatsheet) - creating the README.md and TESTING.md documentation.

References used to gain a general understanding about the podcast, and for creating website content:

- TBC
    
## Technologies Used

- The website was built using [HTML](https://en.wikipedia.org/wiki/HTML), [CSS](https://en.wikipedia.org/wiki/CSS),  [JavaScript](https://en.wikipedia.org/wiki/JavaScript), and [Bootstrap.](https://en.wikipedia.org/wiki/Bootstrap_(front-end_framework)).
- [Google Chrome Developer Tools](https://developer.chrome.com/docs/devtools/) was used for website troubleshooting, and testing (including [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) reports).
- [Google Chrome](https://www.google.co.uk/chrome/) was used for website testing.
- The [Responsive Viewer](https://responsiveviewer.org/) extension was used in all browsers (except Firefox, which does not seem to support it) to create images of the website's pages on a variety of devices.
- The [GoFullPage](https://gofullpage.com/) extension was used in all browsers (except Firefox, which does not seem to support it) to capture full-sized images of the website's pages.
- [Microsoft Edge](https://www.microsoft.com/en-gb/edge/) was used for website testing.
- [Firefox](https://www.mozilla.org/en-GB/firefox/new/) was used for website testing.
- [Opera](https://www.opera.com/) was used for website testing.
- [Safari](https://www.apple.com/uk/safari/) was used for website testing, and mobile screenshots ofan iPhone 12 Pro Max and iPad Pro (12.9-inch) (2nd generation).
- [Figma](https://www.figma.com/) was used to create the wireframes and the user flow diagram.
- [Sarah Renae Clarke's Colour Catalogue V2](https://sarahrenaeclark.com/color-palettes/) was used to determine the website's colur scheme.
- [Font Joy](https://fontjoy.com/) was used to determine font pairings.
- [Google Fonts](https://fonts.google.com/) was used to source the Marcellus and Pontano Sans fonts.
- [Brand Palettes](https://brandpalettes.com) was used to source the correct Instagram and Facebook colours.
- [Microsoft Photos](https://apps.microsoft.com/detail/9wzdncrfjbh4?hl=en-gb&gl=US) was used to edit all images.
- [RespImageLint](https://ausi.github.io/respimagelint/) was used to ensure all website images were fully responsive.
- [To WebP](https://towebp.io/) was used to compress images into webp format.
- [FontAwesome](https://fontawesome.com/) was used for social media icons.
- [GitHub](https://github.com/) was used for version control.
- [GitHub Pages](https://pages.github.com/) was used to host the website.
- [Gitpod](https://gitpod.io/) was used as an online IDE.
- [Markdown](https://en.wikipedia.org/wiki/Markdown) was used to create the README.md and TESTING.md documentation.

## Acknowledgements

TBC
