import { Breadcrumb, Layout, Menu, theme } from "antd";
import style from "./header.module.css";
import image from "../../assets/icons/boba-icon.png";
import DrawerComp from "../drawer";
const { Header, Content, Footer } = Layout;

const HeaderComponent = () => {
  return (
    <Layout className="layout">
      <div>
        <header className={style.header}>
          <a href="/">
            CommuniTEA
            <img className={style.icon} src={image} alt="boba icon"></img>
          </a>
          <DrawerComp />
        </header>
      </div>
    </Layout>
  );
};
export default HeaderComponent;
