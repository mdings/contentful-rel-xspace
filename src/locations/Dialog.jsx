import React, {useState, useEffect} from 'react';
import { 
  Flex,
  FormControl,
  EntryCard,
  Select,
 } from '@contentful/f36-components';
import { useCMA, useSDK } from '@contentful/react-apps-toolkit';

const Dialog = () => {
  const sdk = useSDK();

  // Use const [selectValue, setSelectValue] = useState('spaceId:previewApiToken'); 
  const [selectValue, setSelectValue] = useState('<spaceId>:<previewApiToken>');
  const [entries, setEntries] = useState([]);
  const [types, setTypes] = useState([]);

  const handleOnChange = (event) => setSelectValue(event.target.value);
  

  useEffect(() => {
    const space = selectValue.split(':')[0]
    const previewToken = selectValue.split(':')[1]

    async function fetchData() {
      const types = await fetch(`https://preview.contentful.com/spaces/${space}/environments/master/content_types?access_token=${previewToken}`).then(r => r.json())
      setTypes(types.items)

      const results = await fetch(`https://preview.contentful.com/spaces/${space}/environments/master/entries?access_token=${previewToken}`).then(r => r.json())
      setEntries(results.items)
    }
    fetchData();
  }, [selectValue]);

  const AddEntry = (entry, contentTypeName) => {
    const space = selectValue.split(':')[0]
    entry.contentTypeName = contentTypeName
    sdk.close({ space, ...entry });
  }

  return (
    <Flex flexDirection="column" padding="spacingL" paddingTop="spacingM" gap="spacingS">
      <Flex flexDirection="column" alignItems="start">
        <FormControl>
          <FormControl.Label>Space</FormControl.Label>
          <Select
            id="optionSelect-controlled"
            name="optionSelect-controlled"
            value={selectValue}
            onChange={handleOnChange}
          >
            {/* Options below can also be automatically populated using the CMA: https://www.contentful.com/developers/docs/references/content-management-api/#/reference/spaces/spaces-collection */}
            <Select.Option value="<spaceId>:<previewApiToken>">[Your Space Name]</Select.Option>
            <Select.Option value="<spaceId>:<previewApiToken>">[Your Other Space Name]</Select.Option>
            <Select.Option value="<spaceId>:<previewApiToken>">[Your Other Space Name]</Select.Option>
          </Select>
        </FormControl>
      </Flex>
      <Flex flexDirection="column" gap="spacingS">
        {entries.map(entry => {
          const ctName = entry.sys.contentType.sys.id
          const displayCtName = types.find(type => type.sys.id == ctName)
          return (
            <EntryCard key={entry.sys.id}
              onClick={() => AddEntry(entry, displayCtName.name)}
              status="published"
              contentType={displayCtName?.name}
              title={entry.fields?.internalName}
              description={entry.fields?.title}
            />
          )
        })}
      </Flex>
    </Flex>
  )
};

export default Dialog;
