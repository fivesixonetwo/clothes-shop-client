import {Facebook, Instagram, MailOutline, Phone, Pinterest, Room, Twitter,} from "@material-ui/icons";
import styled from "styled-components";
import {mobile} from "../responsive";

const Container = styled.div`
  display: flex;
  padding-top: 10px;
  margin-top: 0.1px;
  background-color: var(--bgSecondary);
  box-shadow: 0 3px 2px 3px gray;
  padding-bottom: 7px;
  ${mobile({flexDirection: "column"})}
`;

const Left = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
`;

const Logo = styled.h1`
  font-weight: bold;
`;

const Desc = styled.p`
`;

const SocialContainer = styled.div`
  display: flex;
  margin-top: 20px
`;

const SocialIcon = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  color: white;
  background-color: #${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`;

const Title = styled.h3`
  margin-bottom: 30px;
  font-weight: bold;
`;
const Right = styled.div`
  flex: 2;
  padding: 10px 20px 20px 20px;
  margin-left: 20px;
  ${mobile({backgroundColor: "#fff8f8"})}
`;

const Seperator = styled.div`
  flex: 1;
`;

const ContactItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const Footer = () => {
    return (
        <Container>
            <Seperator/>
            <Left>
                <Logo>YAMEE</Logo>
                <Desc>
                    There are many variations of passages of Lorem Ipsum available, but
                    the majority have suffered alteration in some form, by injected
                    humour, or randomised words which don’t look even slightly believable.
                </Desc>
                <SocialContainer>
                    <SocialIcon color="3B5999">
                        <Facebook fontSize={"small"}/>
                    </SocialIcon>
                    <SocialIcon color="E4405F">
                        <Instagram fontSize={"small"}/>
                    </SocialIcon>
                    <SocialIcon color="55ACEE">
                        <Twitter fontSize={"small"}/>
                    </SocialIcon>
                    <SocialIcon color="E60023">
                        <Pinterest fontSize={"small"}/>
                    </SocialIcon>
                </SocialContainer>
            </Left>
            <Right>
                <Title>Contact</Title>
                <ContactItem>
                    <Room style={{marginRight: "10px"}}/> 622 Dixie Path , South Tobinchester 98336
                </ContactItem>
                <ContactItem>
                    <Phone style={{marginRight: "10px"}}/> +1 234 56 78
                </ContactItem>
                <ContactItem>
                    <MailOutline style={{marginRight: "10px"}}/> contact@yamee.com
                </ContactItem>
            </Right>
            <Seperator/>
        </Container>
    );
};

export default Footer;
