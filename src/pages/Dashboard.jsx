import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { fetchApi } from "../store/api";



const Dashboard = () => {


    const [data, setData] = useState(0);
    useEffect(() => {
        fetchApi("/wp-json/custom/v1/user-data")
            .then(res => res.json())
            .then(json => setData(json))
            .catch(err => console.error(err));
    }, []);

    const getUser = async (token) => {
        try {
            const res = await fetchApi("/wp-json/wp/v2/users/me");

            const user = await res.json();

            console.log("USER:", user.roles[0]);
        } catch (error) {
            console.error("ERROR:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            getUser(token);
        }
    }, []);




    return <>
        <div className="wrapper">

            {/* <?php get_sidebar(); ?> */}
            <section>
                <div className="main-content">
                    <div className="row">
                        <div className="clearfix"></div>

                        <div className="panel panel-default">
                            <div className="panel-heading"><h3 className="mb0 mt0 text-muted">2025 Validation Type</h3></div>
                            <div className="panel-body text-center">
                                <div className="row">
                                    <div className="col-md-3">
                                        <a href=""><canvas data-toggle="classyloader" data-percentage="" data-speed="40" data-line-color="#3babc8" data-remaining-line-color="#edf2f6" data-line-width="2" width="200" height="200"></canvas>
                                            <h3 className="mb0 text-muted"><br />Verfied - {data.verified}</h3>
                                        </a>
                                    </div>
                                    <div className="col-md-3">
                                        <a href="">
                                            <canvas data-toggle="classyloader" data-percentage="" data-speed="40" data-line-color="#3babc8" data-remaining-line-color="#edf2f6" data-line-width="2" width="200" height="200"></canvas>
                                            <h3 className="mb0 text-muted"><br />Incomplete - {data.incomplete}</h3>
                                        </a>
                                    </div>
                                    <div className="col-md-3">
                                        <a href="">
                                            <canvas data-toggle="classyloader" data-percentage="" data-speed="40" data-line-color="#3babc8" data-remaining-line-color="#edf2f6" data-line-width="2" width="200" height="200"></canvas>
                                            <h3 className="mb0 text-muted"><br />Rejected</h3>
                                        </a>
                                    </div>
                                    <div className="col-md-3">
                                        <a href="">
                                            <canvas data-toggle="classyloader" data-percentage="" data-speed="40" data-line-color="#3babc8" data-remaining-line-color="#edf2f6" data-line-width="2" width="200" height="200"></canvas>
                                            <h3 className="mb0 text-muted"><br />Returned</h3>
                                        </a>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="clearfix"></div>
                        <div className="col-md-2">
                            {/*  START widget */}
                            <div className="panel widget">
                                <div className="panel-body bg-info">
                                    <div className="text-lg m0"></div>
                                    <p>Total Registered - {data.subscriber_count}</p>
                                    <div className="mb-lg"></div>
                                </div>
                            </div>
                            {/*  END widget  */}
                        </div>

                        <div className="col-md-2">
                            {/* START widget */}
                            <div className="panel widget">
                                <div className="panel-body bg-info">

                                    <div className="text-lg m0"></div>
                                    <p>Total Attendance - {data.attendance}</p>
                                    <div className="mb-lg"></div>
                                </div>
                            </div>
                            {/* END widget */}
                        </div>

                        <div className="col-md-2">
                            {/*  START widget */}
                            <div className="panel widget">
                                <div className="panel-body bg-info">

                                    <h2 className="m0">Total Attendee</h2>

                                    <h3 className="m0">Yes - {data.attendee_yes}</h3>

                                    <h3 className="m0">No - {data.attendee_no}</h3>
                                    <div className="mb-lg"></div>
                                </div>
                            </div>
                            {/* END widget */}
                        </div>

                        <div className="col-md-2">
                            {/* START widget */}
                            <div className="panel widget">
                                <div className="panel-body bg-info">

                                    <div className="text-lg m0"></div>
                                    <p>Total Onsite Attendee - {data.onsite}</p>
                                    <div className="mb-lg"></div>
                                </div>
                            </div>
                            {/* END widget */}
                        </div>

                        <div className="col-md-2">
                            {/*  START widget */}
                            <div className="panel widget">
                                <div className="panel-body bg-info">

                                    <div className="text-lg m0"></div>
                                    <p>Total Online Attendee - {data.online}</p>
                                    <div className="mb-lg"></div>
                                </div>
                            </div>
                            {/* END widget */}
                        </div>

                        <div className="col-md-2">
                            {/* START widget */}
                            <div className="panel widget">
                                <div className="panel-body bg-info">

                                    <div className="text-lg m0"></div>
                                    <p>Total Companions - {data.companion}</p>
                                    <div className="mb-lg"></div>
                                </div>
                            </div>
                            {/* END widget */}
                        </div>
                    </div>


                    <div className="panel panel-default">
                        <div className="panel-heading"><h3 className="mb0 mt0 text-muted">Registrant Type</h3></div>
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-lg-3">
                                    {/*  START widget */}
                                    <a href="<?php echo get_permalink(88); ?>?filter=0">
                                        <div className="panel widget">
                                            <div className="row row-table row-flush">
                                                <div className="col-xs-4 bg-success text-center">
                                                    <em className="fa fa-users fa-2x"></em>
                                                </div>
                                                <div className="col-xs-8">
                                                    <div className="panel-body text-center">
                                                        <h4 className="mt0 text-lg mb0"></h4>
                                                        <p className="mb0 text-muted">Online Registrant</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    {/* END widget */}
                                </div>

                                <div className="col-lg-3">
                                    {/* START widget */}
                                    <a href="<?php echo get_permalink(88); ?>?filter=2">
                                        <div className="panel widget">
                                            <div className="row row-table row-flush">
                                                <div className="col-xs-4 bg-warning text-center">
                                                    <em className="fa fa-users fa-2x"></em>
                                                </div>
                                                <div className="col-xs-8">
                                                    <div className="panel-body text-center">
                                                        <h4 className="mt0 text-lg mb0"></h4>
                                                        <p className="mb0 text-muted">On-site Registrant</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    {/* END widget */}
                                </div>

                                <div className="col-lg-2">
                                    {/*  START widget */}
                                    <a href="<?php echo get_permalink(88); ?>?filter=1">
                                        <div className="panel widget">
                                            <div className="row row-table row-flush">
                                                <div className="col-xs-4 bg-inverse text-center">
                                                    <em className="fa fa-users fa-2x"></em>
                                                </div>
                                                <div className="col-xs-8">
                                                    <div className="panel-body text-center">
                                                        <h4 className="mt0 text-lg mb0"></h4>
                                                        <p className="mb0 text-muted">Mall Registrant</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    {/* END widget */}
                                </div>

                                <div className="col-lg-2">
                                    {/* START widget */}
                                    <a href="<?php echo get_permalink(88); ?>?filter=3">
                                        <div className="panel widget">
                                            <div className="row row-table row-flush">
                                                <div className="col-xs-4 bg-danger text-center">
                                                    <em className="fa fa-users fa-2x"></em>
                                                </div>
                                                <div className="col-xs-8">
                                                    <div className="panel-body text-center">
                                                        <h4 className="mt0 text-lg mb0"></h4>
                                                        <p className="mb0 text-muted">Networker Registrant</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    {/* END widget */}
                                </div>

                                <div className="col-lg-2">
                                    {/* START widget */}
                                    <a href="<?php echo get_permalink(88); ?>?filter=3">
                                        <div className="panel widget">
                                            <div className="row row-table row-flush">
                                                <div className="col-xs-4 bg-danger text-center">
                                                    <em className="fa fa-users fa-2x"></em>
                                                </div>
                                                <div className="col-xs-8">
                                                    <div className="panel-body text-center">
                                                        <h4 className="mt0 text-lg mb0"></h4>
                                                        <p className="mb0 text-muted">OWWA Members</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    {/* END widget */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="clearfix"></div>

                    <div className="panel panel-default admin-mall-registrant">
                        <div className="panel-heading"><h3 className="mb0 mt0 text-muted">OFW Type</h3></div>
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="panel widget">
                                        <div className="row row-table row-flush">
                                            <div className="col-xs-4 bg-danger text-center">
                                                <em className="fa fa-users fa-2x"></em>
                                            </div>
                                            <div className="col-xs-8">
                                                <div className="panel-body text-center">

                                                    <h4 className="mt0 text-lg mb0"></h4>
                                                    <p className="mb0 text-muted">Total OFW</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="panel widget">
                                        <div className="row row-table row-flush">
                                            <div className="col-xs-4 bg-danger text-center">
                                                <em className="fa fa-users fa-2x"></em>
                                            </div>
                                            <div className="col-xs-8">
                                                <div className="panel-body text-center">

                                                    <h4 className="mt0 text-lg mb0"></h4>
                                                    <p className="mb0 text-muted">Total Relative of OFW</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>

                    <div className="clearfix"></div>

                    <div className="panel panel-default">
                        <div className="panel-body">
                            {/* Nav tabs */}
                            <ul className="nav nav-tabs flex-center">
                                <li className=""><a href="#country" data-toggle="tab">Country</a>
                                </li>
                                <li className=""><a href="#region" data-toggle="tab">Region</a>
                                </li>
                                <li className="active"><a href="#province" data-toggle="tab">Province</a>
                                </li>
                                <li className=""><a href="#city" data-toggle="tab">City</a>
                                </li>
                                <li className=""><a href="#city_ncr" data-toggle="tab">City under Metro Manila</a>
                                </li>
                            </ul>
                            {/* Tab panes */}

                            <div className="tab-content">
                                <div id="region" className="tab-pane fade">
                                    <div className="col-md-12">

                                        <h2>Region : </h2>
                                        <div className="custom-chart">

                                            <div className="c-chart-list">
                                                <div className="chart-label">
                                                    <h5></h5>
                                                </div>
                                                <div className="chart-line">
                                                    <div className="char-barline">
                                                        <div className="chart-number"></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div id="province" className="tab-pane fade active in">
                                    <div className="col-md-12">

                                        <h2>Provinces : </h2>
                                        <div className="custom-chart">

                                            <div className="c-chart-list">
                                                <div className="chart-label">
                                                    <h5></h5>
                                                </div>
                                                <div className="chart-line">
                                                    <div className="char-barline">
                                                        <div className="chart-number"></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div id="city" className="tab-pane fade">
                                    <div className="col-md-12">

                                        <h2>Cities : </h2>
                                        <div className="custom-chart">

                                            <div className="c-chart-list">
                                                <div className="chart-label">
                                                    <h5></h5>
                                                </div>
                                                <div className="chart-line">
                                                    <div className="char-barline">
                                                        <div className="chart-number"></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div id="city_ncr" className="tab-pane fade">
                                    <div className="col-md-12">

                                        <h2>Cities under Metro Manila : </h2>
                                        <div className="custom-chart">

                                            <div className="c-chart-list">
                                                <div className="chart-label">
                                                    <h5></h5>
                                                </div>
                                                <div className="chart-line">
                                                    <div className="char-barline">
                                                        <div className="chart-number"></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div id="country" className="tab-pane fade">
                                    <div className="col-md-12">

                                        <h2>Country : </h2>
                                        <div className="custom-chart">

                                            <div className="c-chart-list">
                                                <div className="chart-label">
                                                    <h5></h5>
                                                </div>
                                                <div className="chart-line">
                                                    <div className="char-barline">
                                                        <div className="chart-number"></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

        </div>
    </>
}

export default Dashboard;