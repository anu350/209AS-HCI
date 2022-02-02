# Recent changes
- changed component structure
  - App.js simply calls NoteList
  - NoteList.js now populates the sidelist w map of NoteBriefs AND calls DraftNote editor


# missing:
- define refs in NoteList
- link that ref to the elements in the notebriefs
  - so when the edit button is called, the ref can surface back to NoteList
  - and then from NoteList pass down the active note id to DraftNote
  - see the "componentDidMount()" implementation to get an idea of how to fetch and populate editor

this looks relevant. haven't tried it yet:

https://stackoverflow.com/questions/42323279/react-triggering-a-component-method-from-another-component-both-belonging-in
