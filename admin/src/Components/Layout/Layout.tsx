import Header from "../Header/Header"
import './Layout.scss'
import SideBar from "../SideBar/SideBar"

export const Layout = ({children}:{children:React.ReactNode}) => {
    return (
        <div className="layout">
            <SideBar />
            <div className="layout__main">
                <Header />
                <main className="layout__content" >
                    {children}
                </main>
            </div>
        </div>
    )
}   