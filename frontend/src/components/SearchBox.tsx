import { Box, Button, HStack, Input, InputGroup, InputLeftAddon, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const SearchBox = () => {
  const [text, setText] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    if (text){
    console.log(text)
    }
  }, [text])

  const handleSubmit = () => {
    console.log(text)
    navigate("/r/"+text)
  }

  return (
    <Box>
      <Text>Analyze a Sub-Reddit to market your posts better!</Text>
      <HStack>
      <InputGroup>
        <InputLeftAddon children="r/" />
        <Input focusBorderColor="brand.300" value={text} onChange={(e) => setText(e.target.value)}/>
      </InputGroup>
        <Button onClick={() => handleSubmit()}>Submit</Button>
      </HStack>

    </Box>
  );
};

export default SearchBox;
