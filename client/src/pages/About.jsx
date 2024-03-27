import React from 'react'
import Img from "./Images"

const About = () => {
    return (
        <>
            <section id="header" className="d-flex align-items-center" style={{ marginTop: "100px" }}>

                <div className="container-fluid">
                    <div className="row d-flex">
                        <div className="col-10 mx-auto">
                            <div className="row">
                                <div className="col-md-6 pt-1 pt-lg-0 order-2 order-lg-1 d-flex justify-content-center flex-column">
                                    <h2 className="m-5 font-heading">
                                        Pizza Delivery Service is a Web application project made by <span style={{ color: "purple", whiteSpace: "nowrap" }}>Akash Kushwaha</span> under the Internship from <span style={{ color: "purple" }}>Oasis Infobyte</span>.
                                    </h2>
                                </div>
                                <div className="col-lg-6 mt-md-5 mt-lg-5 order-1 order-lg-2 header-img d-flex justify-content-center" style={{ maxWidth: "800px" }}>
                                    <img className="img-fluid" src={Img["PizzaMain"]} alt="" style={{ width: "80%" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section><br /><br />
        </>
    )
}

export default About