import React from "react";
import { Flex, InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
// import { auth } from "firebase-admin";
// import { user } from "firebase-functions/v1/auth";
import { User } from "firebase/auth";

type SearchInputProps = {
  user?: User | null;
};

const SearchInput: React.FC<SearchInputProps> = ({user}) => {
  return (
    <Flex flexGrow={1} maxWidth={ user ? "auto" : "600px"} mr={2} ml={2} align="center">
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          color="gray.400">
          <SearchIcon color="gray.400" mb={1} />
        </InputLeftElement>
        <Input
          placeholder="Search"
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: "none",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          width={ user ? "600px" : "1000px"}
          height="34px"
          bg="gray.50"
        />
      </InputGroup>
    </Flex>
  );
};
export default SearchInput;