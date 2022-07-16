import { Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import RightContent from './RightContent/RightContent';
import SearchInput from './SearchInput';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import Directory from './Directory/Directory';
import useDirectory from '../../hooks/useDirectory';
import { defaultMenuItem } from '../../atoms/directoryMenuAtom';


const Navbar:React.FC = () => {
    const [user, loading, error] = useAuthState(auth);
    const { onSelectMenuItem } = useDirectory();
    
    return (
        <Flex bg="white" height="44px" padding="6px 12px" justify={ { md: "space-between"}}>
            <Flex align ="center" width={{base: "40px", md: "auto"}} mr={{ base: 0, md: 2}}  onClick={() => onSelectMenuItem(defaultMenuItem)} cursor="pointer" > 
                <Image src="/images/iipelogo.png" height = "40px" mr={2}/>
                <Text mr={3}> IIPEConnect </Text>
                {/* Have to make a svg for iipe connect 
                    <Image src="/images/iipeconnectlogo.png" height = "46px" display={{base: "none", md: "unset"}} />
                */}
                { user && <Directory />}
                <SearchInput user={user} />
                <RightContent user={user} />
                
                
                
                
            
            </Flex>
            
        </Flex>
    )
}
export default Navbar;