import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoundBox from "./RoundBox";

const SearchBox = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (value) => {
    console.log(value);
    navigate("/r/" + value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log("do validate");
      handleSubmit(text);
    }
  };

  return (
    <RoundBox>
      <VStack gap={2}>
        <Text>Analyze a Subreddit to market your posts better!</Text>
        <HStack>
          <InputGroup>
            <InputLeftAddon children="r/" />
            <Input
              focusBorderColor="brand.300"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
          <Button onClick={() => handleSubmit(text)}>Submit</Button>
        </HStack>
      </VStack>
    </RoundBox>
  );
};

export default SearchBox;
