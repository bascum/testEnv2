
const Profile = () => {
  return (
<>
{/*<!--====== Start Profile One ======-->*/}
<div className="profile">
   <div className="">
      <div className="">
         <div className="container">
            <div className="profile-content">
               <div className="profile-card">
                  <div className="profile-card-wrapper">
                     <div
                        className="card-header bg_cover"
                        style="
                        background-image: url(https://cdn.ayroui.com/1.0/images/profile/card-bg.jpg);
                        "
                        ></div>
                    { /*<!-- card-header -->*/}
                     <div className="card-profile">
                        <img
                           src="https://cdn.ayroui.com/1.0/images/profile/profile.jpg"
                           alt="Profile"
                           />
                     </div>
                     {/*<!-- card-profile -->*/}
                     <div className="card-content text-center rounded-buttons">
                        <h3 className="card-title">Daryl Dixon</h3>
                        <p className="text">
                           Lorem ipsum dolor sit amet, sed magna etiam adipiscing
                           elit. Mauris id elit tempor, dolor sed curabitur id justo
                           congue, facilisis sem justo. Integer ut facilisis turpis.
                           Praesent amet ullamcorper ante nec ipsum dolor.
                        </p>
                        <a
                           href="javascript:void(0)"
                           className="btn primary-btn rounded-full"
                           data-toggle="modal"
                           data-target="#contact-modal"
                           >
                        Get In Touch
                        </a>
                     </div>
                    {/* <!-- card-content -->*/}
                     <div className="card-social text-center">
                        <ul>
                           <li>
                              <a
                                 className="
                                 btn
                                 primary-btn-outline
                                 rounded-full
                                 icon-btn
                                 btn-sm
                                 facebook
                                 "
                                 href="javascript:void(0)"
                                 >
                              <i className="lni lni-facebook-filled"></i>
                              </a>
                           </li>
                           <li>
                              <a
                                 className="
                                 btn
                                 primary-btn-outline
                                 rounded-full
                                 icon-btn
                                 btn-sm
                                 twitter
                                 "
                                 href="javascript:void(0)"
                                 >
                              <i className="lni lni-twitter-original"></i>
                              </a>
                           </li>
                           <li>
                              <a
                                 className="
                                 btn
                                 primary-btn-outline
                                 rounded-full
                                 icon-btn
                                 btn-sm
                                 instagram
                                 "
                                 href="javascript:void(0)"
                                 >
                              <i className="lni lni-instagram-original"></i>
                              </a>
                           </li>
                           <li>
                              <a
                                 className="
                                 btn
                                 primary-btn-outline
                                 rounded-full
                                 icon-btn
                                 btn-sm
                                 linkedin
                                 "
                                 href="javascript:void(0)"
                                 >
                              <i className="lni lni-linkedin-original"></i>
                              </a>
                           </li>
                        </ul>
                     </div>
                     {/*<!-- card-social -->*/}
                  </div>
                  {/*<!-- profile-card -->*/}
               </div>
              {/* <!-- profile-card -->*/}
            </div>
         </div>
      </div>
   </div>
</div>
</>  )
}

export default Profile