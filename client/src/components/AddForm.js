import React, { useState } from 'react';
import { toHexColor } from '../util';
import { 
  Button, 
  Icon, 
  Form,
} from "semantic-ui-react";

function AddForm() {
  const [ open, setOpen ] = useState(false);
  const [ type, setType ] = useState('');
  const [ content, setContent ] = useState({});
  const [ isPublic, setIsPublic ] = useState(true);
  const [ tags, setTags ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    switch(type) {
      case 'text':
        const body = {
          type,
          tags,
          isPublic,
          title: content.title,
          content: {
            description: content.description || '',
            url: content.url || '',
          },
          creator: 'server', // change this to the creator's gh username
        }
        console.log(body);
        setOpen(false);
        setType('');
        setContent({});
        setIsPublic(true);
        setTags([]);
        break;
      case 'youtube':
      case 'github':
        setIsLoading(true);
        break;
      default:
        break;
    }
    // reset values

  }

  let formContent;
  if (type === '') {
    formContent = (
      <div className='add-options'>
          <Button 
            icon
            labelPosition='left'
            className='add-options_choice'
            onClick={() => setType('text')}
          > 
            <Icon name='sticky note'/>
            Notes
          </Button>
          <Button 
            icon
            labelPosition='left'
            className='add-options_choice'
            onClick={() => setType('youtube')}
          > 
            <Icon name='youtube'/>
            Youtube
          </Button>
          <Button 
            icon
            labelPosition='left'
            className='add-options_choice'
            onClick={() => setType('github')}
          > 
            <Icon name='github alternate'/>
            Github
          </Button>
      </div>
    );
  } else if (type === 'text'){
      formContent = (
        <Form className='add-text' onSubmit={submit}>
          <h3>
          <Icon name='sticky note'/>Post new note
          </h3>            
          <Form.Input
            fluid
            required
            label="Title"
            placeholder="e.g. Intro to MERN stack"
            value={content.title}
            onChange={(e, {value}) => setContent({ ...content, title: value })}
          />
          <Form.Input
            icon='linkify'
            iconPosition='left'
            value={content.url}
            onChange={(e, {value}) => setContent({ ...content, url: value })}
            />  
          <Form.TextArea
            label='Description'
            placeholder='e.g. Learn to build and deploy your first MERN project'
            value={content.description}
            onChange={(e, {value}) => setContent({ ...content, description: value })}
          />
          <TagForm tags={tags} setTags={setTags}/>
          <Form.Group widths='equal'>
            <Form.Radio
              label='Public'
              checked={isPublic}
              onChange={(e, {checked}) => setIsPublic(checked)}
            />
            
            <Form.Radio
              label='Private'
              checked={!isPublic}
              onChange={(e, {checked}) => setIsPublic(!checked)}
            />
          </Form.Group>
          <button className='add-form-submit'>
            Create
          </button>
        </Form>
      );
    } else if (type === 'youtube' || type === 'github') {
      const title = type === 'youtube' ? 'Post a Youtube Video' : 'Post from Github';
      formContent = (
        <Form className='add-text' onSubmit={submit}>
          <h3><Icon name={type}/>{title}</h3>
          {isLoading 
            ? (<div className='loader'></div>)
            :
            (<>
              <Form.Input
                icon='linkify'
                iconPosition='left'
                onChange={(e, {value}) => setContent({...content, url: value})}
                value={content.url || ''}
              />
              <TagForm tags={tags} setTags={setTags}/>
              <button className='add-form-submit'>
                Create
              </button>
            </>)
        }
        </Form>
      );
    } 

  return ( 
    <div>
      <Button
        circular
        icon='plus'
        size='big'
        className={`add-btn ${open ? 'opened' : 'closed'}`}
        onClick={() => { setOpen(!open); setType(''); }}
      />
      { open && (
        <div 
          className={`add-form ${open ? 'opened' : 'closed'} ${type}`}
        >
          {formContent}
        </div>
      )}
    </div>
  );
}

function TagForm(props) {
  const [ value, setValue ] = useState('');
  
  // remove tag at given index
  const removeTag = (idx) => {
    const tags = [...props.tags];
    tags.splice(idx, 1);
    props.setTags(tags);
  }

  // add tags split by commas
  const addTag = (e, {value}) => {
    if (value && value.charAt(value.length - 1) === ',') {
      const tag = value.substring(0, value.length - 1);
      props.setTags(props.tags.concat(tag));
      setValue('');
    } else {
      setValue(value);
    }
  }

  const tags = props.tags.map((tag, i) => {
    return (
      <span 
        key={i}
        className='tag' 
        style={{backgroundColor: toHexColor(tag)}}
        onClick={() => removeTag(i)}
      >
        {`#${tag}`}
      </span>
    )});

  return(
    <div className='tag-form'>
      <div className='tag-form_container'>
        {tags}
      </div>
      <Form.Input
        label='Tags'
        placeholder='Add a comma to confirm each tag'
        value={value}
        onChange={addTag}
      />
    </div>
  )
}

export default AddForm;
