import React, {useState, useEffect} from 'react';
import { 
  EntryCard,
  IconButton,
  Flex,
  Button,
 } from '@contentful/f36-components';
import  {LinkAlternateIcon, CloseIcon, FolderIcon } from '@contentful/f36-icons'
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';

{/* Options below can also be automatically populated using the CMA: https://www.contentful.com/developers/docs/references/content-management-api/#/reference/spaces/spaces-collection */}
const spaces = new Map()
spaces.set('<spaceId>', '<Your Space Name>')
spaces.set('<spaceId>', '<Your Other Space Name>')

const Field = () => {
  const sdk = useSDK();
  const [entries, setEntries] = useState(sdk.field.getValue() || [])

  const onClickHandler = () => {
    sdk.dialogs.openCurrentApp({
      title: 'Add existing content',
      width: 800,
      minHeight: 700,
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      parameters: { test: true, value: 42 },
    })
    .then((entry) => {
      if (entry) {
        const newEntries = entries.concat(entry)
        setEntries(newEntries)
        sdk.field.setValue(newEntries)
      }
     
    });
  }

  useEffect(() => {
    sdk.field.setValue(entries)
  }, [entries])

  useEffect(() => {
    sdk.window.startAutoResizer()
  }, [sdk.window])

  const RemoveAt = index => {
    const currentListCopy = [...entries];
    currentListCopy.splice(index, 1)
    setEntries(currentListCopy)
  }

  const CustomActionButton = ({index}) => <IconButton
    aria-label="Actions"
    icon={<CloseIcon variant="muted" />}
    size="small"
    variant="transparent"
    onClick={() => {RemoveAt(index)}}
  />


  return (
    <Flex flexDirection="column" alignItems="start" gap="spacingS">
     
      {entries.map((entry, index) => {
         return (
            <EntryCard key={index}
              status="published"
              withDragHandle
              contentType={`${entry?.contentTypeName} · ${spaces.get(entry.space)}`}
              title={entry.fields?.internalName}
              description={entry.fields?.title}
              customActionButton={<CustomActionButton id={index} />}
            />
          )
        })
      }
       <Button variant="secondary" size="small" startIcon=<LinkAlternateIcon /> onClick={onClickHandler}>Add existing content</Button>
      </Flex>
    )
};

export default Field;
