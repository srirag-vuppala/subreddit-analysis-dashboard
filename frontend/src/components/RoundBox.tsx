import { Box, useColorModeValue } from '@chakra-ui/react'
import React, { PropsWithChildren } from 'react'

function setDefaults<Props, Defaults>(props: Props, defaults: Defaults): Required<Props> {
   let newProps: Required<Props> = {...props} as Required<Props>;
   const defaultKeys = Object.keys(defaults) as (string)[];
   defaultKeys.forEach(key => {
      const propKey = key as keyof Props;
      const defaultKey = key as keyof Defaults;
      Object.defineProperty(newProps, key, {
         value: props[propKey] !== undefined ? props[propKey] : defaults[defaultKey],
      });
   });
   return newProps;
}

interface RoundBoxProps extends PropsWithChildren<any>{
    children: React.ReactNode,
    padding?: number,
    margin?: number,
    width?: string,
    borderRadius?: string ,
    boxShadow?: string,
}
const RoundBox = (props: RoundBoxProps) => {
    const args = setDefaults(props, {
      margin: 0,
      padding: 5,
      width: 'fit-content',
      borderRadius: 'xl',
      boxShadow: 'md',

   });
  return (
    <Box p={args.padding} m={args.margin} w={args.width} bgColor={useColorModeValue("gray.50", "whiteAlpha.200")} borderRadius={args.borderRadius} boxShadow={args.boxShadow}>
        {props.children}
    </Box>
  )
}

export default RoundBox