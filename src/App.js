import React, { useState, useEffect } from 'react';
import {
  chakra,
  Box,
  Flex,
  useColorModeValue,
  VisuallyHidden,
  HStack,
  Button,
  Icon,
  useDisclosure,
  VStack,
  IconButton,
  Stack, Input, Image,
  SimpleGrid,
  GridItem, Text,
  Container,
  Link,
  useColorMode, useToast
} from "@chakra-ui/react";
import { AiOutlineMenu } from "react-icons/ai";
import { FaMoon, FaSun, FaHeart, FaFire, FaCoffee, FaBars, FaDollarSign } from "react-icons/fa";
import { Logo } from "@choc-ui/logo";
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { 
	TwitterShareButton 
} from 'react-share';

export default function App() {

  const bg = useColorModeValue("white", "gray.800");
  const ref = React.useRef();
  const [y, setY] = React.useState(0);
  const { height = 0 } = ref.current ? ref.current.getBoundingClientRect() : {};
  const [showAlert, setShowAlert] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState();
  const [portfolio, setPortfolio] = useState([]);

  const [offset, setOffset] = useState(0);
  const [ethRate, setEthRate] = useState();
  const [networth, setNetworth] = useState();
  const [usdworth, setUsdworth] = useState();

  const mobileNav = useDisclosure();
  const { toggleColorMode: toggleMode } = useColorMode();
  const text = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);


  useEffect(() => {
    fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD")
      .then(response => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then(data => setEthRate(data.USD))
  }, [])


  const setOwner = event => {
    setOwnerAddress(event.target.value);
    console.log(ownerAddress)
  };



  const getTitle=(networth,usdworth)=>( 

   'Just checked my NFT Portfolio Value on https://floorvalue.co. It’s currently '+networth+' ETH and '+usdworth+' USD. What’s yours?'
  )


  const toast = useToast()

  function fieldError(msg) {
    toast({
      render: () => (
        <Box color="white" p={3} bg="red.500">
          {msg}
        </Box>
      ),
    })
  }

  const socialConfig={
          twitterHandle:"@livingpixelated",
          config: {
            url: "https://floorvalue.co",
            title:"",
          },
        }

  const fetchData = async () => {

    setPortfolio([]);
    if (ownerAddress === undefined || ownerAddress === '') {
      fieldError('Please enter Owner Address');
      return;
    }

    const options = { method: 'GET' };
    const limit = 50;
    const url = new URL("https://api.opensea.io/api/v1/collections");
    const params = { asset_owner: ownerAddress, offset, limit };

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    fetch(url, options)
      .then(response => response.json())
      .then(response => {
        const data = response;
        console.log(data);

        if (data === 'Not valid address') {
          fieldError(data);
          return;
        }

        portfolio.splice(0, portfolio.length);
        var xnetworth = 0;
        data.forEach(function (item) {
          console.log(item);

          portfolio.push({
            id: item.address,
            name: item.name,
            assetCount: item.owned_asset_count,
            floorValue: item.stats.floor_price,
            total: item.stats.floor_price * item.owned_asset_count,
            imageurl: item.image_url
          })

          xnetworth += item.stats.floor_price * item.owned_asset_count;

        });

 
        setNetworth((Math.round(xnetworth  * 1000) / 1000).toFixed(3));
        setUsdworth((Math.round(xnetworth * ethRate * 100) / 100).toFixed(2));
        setPortfolio(portfolio);

        console.log(portfolio);
      })
      .catch(err => console.log(err));

  }
 

  const SocialButton = ({
    children,
    label,
    href,
  }) => {
    return (
      <chakra.button
        bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
        rounded={'full'}
        w={8}
        h={8}
        cursor={'pointer'}
        as={'a'}
        href={href}
        display={'inline-flex'}
        alignItems={'center'}
        justifyContent={'center'}
        transition={'background 0.3s ease'}
        _hover={{
          bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
        }}>
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </chakra.button>
    );
  };

  const Feature = (props) => {
    return (
      <Flex>
        <Flex shrink={0}>
          <Icon
            boxSize={5}
            mt={1}
            mr={2}
            color={useColorModeValue("brand.500", "brand.300")}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </Icon>
        </Flex>
        <Box ml={4}>
          <chakra.dt
            fontSize="lg"
            fontWeight="bold"
            lineHeight="6"
            color={useColorModeValue("gray.900")}
          >
            {props.title}
          </chakra.dt>
          <chakra.dd mt={2} color={useColorModeValue("gray.500", "gray.400")}>
            {props.children}
          </chakra.dd>
        </Box>
      </Flex>
    );
  };

  const SponsorButton = (
    <Box
      display={{ base: "none", md: "flex" }}
      alignItems="center"
      as="a"
      aria-label="Sponsor Choc UI on Open Collective"
      href={"https://twitter.com/messages/compose?recipient_id=16984407"}
      target="_blank"
      rel="noopener noreferrer"
      bg="gray.50"
      borderWidth="1px"
      borderColor="gray.200"
      px="1em"
      minH="36px"
      rounded="md"
      fontSize="sm"
      color="gray.800"
      outline="0"
      transition="all 0.3s"
      _hover={{
        bg: "gray.100",
        borderColor: "gray.300",
      }}
      _active={{
        borderColor: "gray.200",
      }}
      _focus={{
        boxShadow: "outline",
      }}
      ml={5}
    >
      <Icon as={FaHeart} w="4" h="4" color="red.500" mr="2" />
      <Box as="strong" lineHeight="inherit" fontWeight="semibold">
        Sponsor
      </Box>
    </Box>
  );
  const MobileNavContent = (
    <VStack
      pos="absolute"
      top={0}
      left={0}
      right={0}
      display={mobileNav.isOpen ? "flex" : "none"}
      flexDirection="column"
      p={2}
      pb={4}
      m={2}
      bg={bg}
      spacing={3}
      rounded="sm"
      shadow="sm"
    >
    </VStack>
  );
  return (
    <Box pos="relative">
      <chakra.header
        ref={ref}
        shadow={y > height ? "sm" : undefined}
        transition="box-shadow 0.2s"
        bg={bg}
        borderTop="6px solid"
        borderTopColor="#14e60c"
        w="full"
        overflowY="hidden"
      >
        <chakra.div h="4.5rem" mx="auto" maxW="1200px">
          <Flex w="full" h="full" px="6" align="center" justify="space-between">
            <Flex align="center">
              <Link href="/">
                <HStack>
                  <Logo color="#14e60c"/>
                  <chakra.h1
                    mb={3}
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight={{ base: "bold", md: "extrabold" }}
                    color={useColorModeValue("gray.900", "gray.100")}
                    lineHeight="shorter"
                  >
                    FloorValue.co
                  </chakra.h1>
                </HStack>
              </Link>
            </Flex>

            <Flex
              justify="flex-end"
              w="full"
              maxW="824px"
              align="center"
              color="gray.400"
            >
              <IconButton
                size="md"
                fontSize="lg"
                aria-label={`Switch to ${text} mode`}
                variant="ghost"
                color="current"
                ml={{ base: "0", md: "3" }}
                onClick={toggleMode}
                icon={<SwitchIcon />}
              />
              {SponsorButton} 
            </Flex>
          </Flex> 
        </chakra.div>
      </chakra.header>
      <Flex
        p={5}
        justifyContent="center"
        alignItems="center"
       
      >
        <Box px={4} py={2} mx="auto">
          <Box
            w={{ base: "full", md: 11 / 12, xl: 8 / 12 }}
            textAlign={{ base: "center", md: "center" }}
            mx="auto"
          >
            <chakra.h1
              mb={3}
              fontSize={{ base: "3xl", md: "5xl" }} 
              pt={{ base: 150, md:150 }}
              color={useColorModeValue("gray.900", "gray.100")}
              lineHeight="shorter"
            >
              Get an estimated value of your NFT Portfolio on  <Text
                ml={3}
                display={{ base: "block", lg: "inline" }}
                w="full"
                bgClip="text"
                color="white.500" 
                fontWeight="bold"
                >
                  OpenSea
              </Text>
            </chakra.h1>
            <SimpleGrid
              as="form"
              w={{ base: "full", md: 7 / 12 }}
              columns={{ base: 1, lg: 6 }}
              spacing={3}
              pt={1}
              mx="auto"
              mb={8}
            >
              <GridItem as="label" colSpan={{ base: "auto", lg: 4 }}>
                <Input
                  mt={0}
                  size="lg"
                  type="text"
                  name='setOwner'
                  placeholder="Enter your wallet address..."
                  onChange={setOwner}
                />
              </GridItem>
              <Button
                as={GridItem}
                w="full"
                variant="solid"
                colSpan={{ base: "auto", lg: 2 }}
                size="lg"
                type="submit"
                onClick={() => fetchData()}
                bg="#14e60c"
                cursor="pointer"
              >
                Go
              </Button>
            </SimpleGrid>
            
          </Box>
          
        </Box>

      </Flex>
      {portfolio &&
        portfolio.length > 0 && (
      <Flex justifyContent="space-between" 
        shadow="xl"
        maxW={1960}
        px={8}
        py={5}
        mx="auto"
        borderRadius={15}
      >
        <SimpleGrid 
              maxW={1960} 
              mx={{ base: "auto", md: "inline-flex" }}
              columns={{ base: 2, lg: 2 }}
              spacingY={{ base: 2, lg: 2 }}
              spacingX={{ base: 2, lg: 2 }}
              display={{ base: "flow", md: "inline-flex" }}
            >
        <HStack  display={{ base: "inline-flex", md: "inline-flex" }}>
          <chakra.h1 
            fontSize={{ base: "1xl", md: "2xl" }}
            fontWeight={{ base: "bold", md: "extrabold" }}
            color={useColorModeValue("gray.900", "gray.100")} 
            display={{ base: "inline-flex", md: "inline-flex" }}
            lineHeight="shorter"
          >
            <Icon as={FaBars} w="6" h="6" color="brand.500" mr="2" mt={{ base: "0", md: "1" }} /> 
           {networth} 
           <Text px={2}
            color="brand.500"
            fontWeight="extrabold"
            > ETH
          </Text>
          </chakra.h1> 
          <chakra.h1 
            fontSize={{ base: "1xl", md: "2xl" }}
            fontWeight={{ base: "bold", md: "extrabold" }}
            color={useColorModeValue("gray.900", "gray.100")}
            lineHeight="shorter"
            display={{ base: "inline-flex", md: "inline-flex" }}
          > 
            <Icon as={FaDollarSign} w="6" h="6" color="brand.500" mr="2"  mt={{ base: "0", md: "1" }}/> 
           {usdworth} 
           <Text px={2}
            color="brand.500"
            fontWeight="extrabold"
            > 
            USD
          </Text> 
          </chakra.h1>
        </HStack>
        <HStack mx={{base: "0", md: "20"}}>
          <chakra.h4  
            fontWeight={{ base: "bold", md: "extrabold" }}
            color={useColorModeValue("gray.900", "gray.100")}
            lineHeight="shorter"
          >
               Share your Portfolio Value
               
          </chakra.h4>
          <Box
                  display={{ base: "inline-flex", md: "inline-flex" }}
                  alignItems="center"
                  as="a"  
                  target="_blank"
                  rel="noopener noreferrer"
                  bg="blue.400" 
                  px="1em" 
                  rounded="md"
                  fontSize="sm"
                  color="white.800"
                  outline="0"
                  transition="all 0.3s"
                  _hover={{
                    bg: "gray.100",
                    borderColor: "gray.300",
                  }}
                  _active={{
                    borderColor: "gray.200",
                  }}
                  _focus={{
                    boxShadow: "outline",
                  }} 
                >
                <TwitterShareButton url={socialConfig.config.url}
                title={getTitle(networth,usdworth)} >
                  <span className="icon">
                    <Icon as={FaTwitter} w="6" h="6" color="white.400" mr="2" /> 
                  </span>
                  <span className="text">Twitter</span>
                </TwitterShareButton>
                </Box>
        </HStack>
        </SimpleGrid>
      </Flex>)}

      {portfolio &&
        portfolio.length > 0 &&
        portfolio.slice().map(item => (
          <Box
            shadow="xl"
            maxW={960}
            px={8}
            py={5}
            mx="auto"
            borderRadius={15}
            key={item.id}
          >
            <chakra.h2
              mb={3}
              fontSize={{ base: "1xl", md: "2xl" }}
              fontWeight="extrabold"
              textAlign={{ base: "center", sm: "center" }}
              lineHeight="shorter"
              letterSpacing="tight"
            >
              {item.name}
            </chakra.h2>
            <SimpleGrid
              alignItems="center"
              alignSelf="center"
              justifyContent="center"
              columns={{ base: 1, lg: 4 }}
              spacingY={{ base: 3, lg: 8 }}
              spacingX={{ base: 3, lg: 8 }}
            >
              <Box alignSelf="center">
                <Image src={item.imageurl} />
              </Box>
              <GridItem colSpan={3}>
                <Stack
                  spacing={{ base: 10, md: 0 }}
                  display={{ md: "grid" }}
                  gridTemplateColumns={{ md: "repeat(3,1fr)" }}
                  gridColumnGap={{ md: 8 }}
                  gridRowGap={{ md: 10 }}
                >
                  <Feature title="Asset Count">
                    <chakra.h4
                      mb={3}
                      fontWeight="extrabold"
                      textAlign={{ base: "center", sm: "left" }}
                      lineHeight="shorter"
                      letterSpacing="tight"
                    >
                      {item.assetCount}
                    </chakra.h4>
                  </Feature>
                  <Feature title="Floor Price">
                    <chakra.h4
                      mb={3}
                      fontWeight="extrabold"
                      textAlign={{ base: "center", sm: "left" }}
                      lineHeight="shorter"
                      letterSpacing="tight"
                    >
                      {item.floorValue} ETH
                    </chakra.h4>
                  </Feature>
                  <Feature title="Total Value">
                    <chakra.h4
                      mb={3}
                      fontWeight="extrabold"
                      textAlign={{ base: "center", sm: "left" }}
                      lineHeight="shorter"
                      letterSpacing="tight"
                    >
                      {item.total} ETH
                    </chakra.h4>
                  </Feature>
                </Stack>
              </GridItem>
            </SimpleGrid>
          </Box>))}

          <Box  m={'auto'} pt={20} textAlign={{ base: "center", md: "center" }}
>
            <a href="https://twitter.com/coffeejunkienft">
                <chakra.p 
                maxW="2xl"
                fontSize="md" 
                m={{ lg: "auto" }} 
              >
                <Icon as={FaFire} w="4" h="4" color="red.500" mr="2" />
                Join the Coffee Junkie Club.
                <Icon as={FaCoffee} w="4" h="4" color="brown.500" mr="2" />
              </chakra.p>
            </a>

        <Container
          as={Stack}
          maxW={'2xl'}
          py={4}
          spacing={4}
          justify={'center'}
          align={'center'}>
             <a href="https://twitter.com/coffeejunkienft">
                <chakra.p 
                maxW="2xl"
                fontSize="sm" 
                m={{ lg: "auto" }} 
              >
                  <Text 
                maxW="2xl"
                fontSize="sm" 
                m={{ lg: "auto" }}
                >Made with <Icon as={FaHeart} w="4" h="4" color="red.500" mr="2" /> 
                  
                  by @livingpixelated. If you have any suggestions drop a message on 
                    Twitter and if you enjoy the website please share it.</Text> 
                </chakra.p>
            </a>
        </Container> 
      </Box>     
          
    </Box>
  );
}
