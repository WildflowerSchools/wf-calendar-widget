# wf-calendar-widget

Simple Google Calendar JS Widget

### Test

1) `npm install`
2) Use the `.env.template` to create a `.env` file
3) Update ENV vars in `.env` file:

```
CALENDAR_ID=<<Google calendar ID>>
GOOGLE_API_KEY=<<Your own API key created using GCP>>
```

4) `npm start`


### Release

1) `npm run build`

2) Host the JS and index.html that's created in: `build/`

3) Load in an iFrame using the following  (notice the HOSTED_URL and VERSION tags that must be replaced):

`<iframe src="<<HOSTED_URL>>/index.<<VERSION>>.html" style="width:100%;height:350px;" />`
