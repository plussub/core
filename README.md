# +Sub Core
[![Build Status](https://travis-ci.org/ste-xx/plussub.svg?branch=master)](https://travis-ci.org/plussub/chrome-extension)

This repository contains code:
- to inject srt/vtt files to html video.
- to search movies with http://www.moviedb.com
- to search subtitles with http://www.opensubtitles.org
- to parse srt files
- to customize subtitle layout

This repo will be used for: <br>
https://github.com/plussub/chrome-extension <br>
https://github.com/plussub/landingpage <br>

## Quickstart

### Prerequisite
- npm

### Build Project
1) npm install
2) bower install

### Run tests
- gulp mocha_unit for unit tests
- gulp mocha_integration for integration tests


## Architecture Overview: 

### State Handling

All states are handled with redux. 
Reducer and Actions can be found in redux. 
It exists different configuration for different use cases.

#### ConfigForWebapp
- Use local storage to store/load state
- Use real redux store

#### ConfigForTests
- Does not store any state
- Use real redux store
   
#### ConfigForExtensions

###### Background Config
- Use local storage to store/load state
- Use real redux store
- Broadcast state update to ui elements with 'background bridge'

###### UI-Element Config
- Get stored state from background Redux via 'app bridge'
- Receive/Send state change from/to background Redux via 'app bridge'


### Sub packages

#### Background
- Triggers Ajax calls to other datasources like www.moviedb.com
- Subtitle parsing 
- Hold, shares and saves application states

#### App
The main user interface.
From here it is posible to use the main featuers like: 
- trigger movie search
- trigger subtitle search
- load subtitle files
- delay subtitle
- show current loaded subtitle information  

#### Content scripts
- Search &lt;video&gt; tags on websites
- Inject subtitles

#### Option
User interface to set additional options like: 
- subtitle customizing 
- debug settings

#### Theme 
Contains theming for app and option pages. 

#### Descriptor
Shared action definition for redux.