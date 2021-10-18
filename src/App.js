
import React, {useState, useEffect} from 'react'
import {SketchPicker} from 'react-color';
import {Input, Button} from 'antd'
import { DataStore } from '@aws-amplify/datastore';
import {Message} from './models'

const initialState = { color: '#00000', title: ''}

function App() {
  const [formState, updateFormState] = useState(initialState);
  const [message, updateMessage] = useState([]);
  const [showPicker, updateShowerPicker] = useState(false);

  useEffect(() => {
    fetchMessages()
    const subscription = DataStore.observe(Message).subscribe(() => fetchMessages())
    return () => subscription.unsubscribe()
  })

  function onChange(e) {
    if(e.hex){
      updateFormState({...formState, color: e.hex})
    }else {updateFormState({...formState, title: e.target.value})}
  }
  async function fetchMessages() {
    const Messages = await DataStore.query(Message)
    updateMessage(Messages)
  }

  async function createMessage() {
    if(!formState.title) return await DataStore.save(new Message({...formState}))
    updateFormState(initialState)
  }
  
  return (
    <div>
      <h1 >Real Time Message Board</h1>
      <Input 
      onChange={onChange}
      name='title'
      placeholder='Messae Title'
      value={formState.title}
      />
      
    </div>
   
  );
}

export default App;


