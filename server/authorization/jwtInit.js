module.exports = app=> {
  'use strict';
  const updateLastLogin = require('../utils/utils')(app.locals.db).updateLastLogin;
  const authenticate    = require('./authentication').authenticate;
  const hashPwd    = require('./authentication').hashPwd;
  const {success: rhs}  = require('../authorization/requestHandler');
  const emailSender     = require('../utils/emailSender')(global.smtpTransportYour);
  const jwt             = require('jsonwebtoken');
  const router          = require('express').Router();
  const async           = require('async');
  const _               = require('lodash');

  function render(res, user, req) {
    delete user.salt;
    delete user.password;

    user.token = jwt.sign({id: user.id}, app.locals.config.sKey, {expiresIn: 86400});
    updateLastLogin(user.id, req);
    res.json(user);
  }

  // router.post('/login', (req, res)=> {
  //   let d = new RegExp('"', 'g');
  //   let q = new RegExp('\'', 'g');
  //   let email = req.body.email.toLowerCase().replace(d, '').replace(q, '').replace(/\s/g, '');
  //   let email_regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  //   // app.locals.db.models.User.create({role: 'sa', email: 'costi.tuca@gmail.com', password: '123123'}).then(resp => {
  //   //   logAction(req.user.id, 'adminUserCtrl - create', `Creare utilizator - rol: ${resp.role}, id: ${resp.id}, nume: ${resp.first_name} ${resp.last_name}`);
  //   //   rhs(res);
  //   // }).catch(e => logError(req.user, 'adminUserCtrl - create (sa)', e, res, req));
  //   if (email_regex.test(email)) {
  //     req.body.email = req.body.email.replace(/\s/g, '');
  //     app.locals.db.query(`SELECT id, first_name, last_name, email, role, active, password, salt, id_unit, current_month, uuid, gdpr, TO_CHAR(COALESCE(current_month, NOW()), 'yyyy')::INTEGER AS current_year, phone FROM "User" WHERE TRIM(email) = '${req.body.email}'`, {type: app.locals.db.QueryTypes.SELECT}).then(user => {
  //       if (user.length) {
  //         // if (req.body.uuid === user[0].uuid || user[0].role === 'sa') {
  //           if (user[0].active) {
  //             if (authenticate(req.body.password, user[0].salt, user[0].password)) {
  //               if (user[0].role !== 'admin' && user[0].role !== 'sa') {
  //                 const tasks = [];
  //                 let unit, address;

  //                 if(user[0].role === 'student') {
  //                   tasks.push(cb => {
  //                     app.locals.db.query(`SELECT s.id, s.id_class, s.first_name, s.last_name, c.id_class_organization
  //                     FROM "Student" s
  //                     LEFT JOIN "Class" c ON c.id = s.id_class
  //                     WHERE s.id_user = ${user[0].id}`, { type: app.locals.db.QueryTypes.SELECT }).then(resp => {
  //                       if(resp.length) {
  //                         user[0].id_student = resp[0].id;
  //                         user[0].id_class = resp[0].id_class;
  //                         user[0].first_name = resp[0].first_name;
  //                         user[0].last_name = resp[0].last_name;
  //                         user[0].id_class_organization = resp[0].id_class_organization;
  //                       }
  //                       cb();
  //                     }).catch(e => cb(e));
  //                   });
  //                 } else if(user[0].role === 'parent') {
  //                   tasks.push(cb => {
  //                     app.locals.db.query(`SELECT p.id, p.first_name, p.last_name
  //                     FROM "Parent" p
  //                     WHERE p.id_user = ${user[0].id}`, { type: app.locals.db.QueryTypes.SELECT }).then(resp => {
  //                       if(resp.length) {
  //                         user[0].id_parent = resp[0].id;
  //                         user[0].first_name = resp[0].first_name;
  //                         user[0].last_name = resp[0].last_name;
  //                       }
  //                       cb();
  //                     }).catch(e => cb(e));
  //                   });
  //                   tasks.push(cb => {
  //                     app.locals.db.query(`SELECT s.id, s.id_unit, s.id_class, s.first_name, s.last_name, s.birthday_date AS birthday_date_order
  //                     , TO_CHAR(s.birthday_date, 'dd.MM.yyyy') AS birthday_date, CONCAT('Clasa a ', cn.number, '-a ', COALESCE(c.letter, '')) AS class, c.id_class_organization
  //                     FROM "Parent" p
  //                     LEFT JOIN "ParentStudent" ps ON ps.id_parent = p.id
  //                     LEFT JOIN "Student" s ON s.id = ps.id_student
  //                     LEFT JOIN "Class" c ON c.id = s.id_class
  //                     LEFT JOIN "ClassNumber" cn ON cn.id = c.id_class_number
  //                     WHERE p.id_user = ${user[0].id}`, { type: app.locals.db.QueryTypes.SELECT }).then(resp => {
  //                       if(resp.length) {
  //                         user[0].students = _.orderBy(resp, 'birthday_date_order');
  //                         let t = [];
  //                         _.forEach(user[0].students, s => {
  //                           t.push(cb1 => {
  //                             app.locals.db.query(`SELECT u.id, u.name, u.cui, u.phone, u.email, u.fax, u.initialized, u.id_semester, u.year, u.days_grade, u.days_absence, ut.id AS id_unit_type, s.name AS name_semester
  //                             FROM "Unit" u
  //                             LEFT JOIN "DraftUnitType" ut ON ut.id = u.id_draft_unit_type
  //                             LEFT JOIN "CfgSemester" s ON s.id = u.id_semester
  //                             WHERE u.id = ${s.id_unit}`, { type: app.locals.db.QueryTypes.SELECT }).then(r => {
  //                               if(r.length) {
  //                                 s.unit = r[0];
  //                               }
  //                               cb1();
  //                             }).catch(e => cb1(e));
  //                           });

  //                           t.push(cb1 => {
  //                             app.locals.db.query(`SELECT a.id_county, c.name AS county_name, a.id,a.id_village, v.name AS village_name, l.type_locality, l.type_village,
  //                             a.id_locality, l.name AS locality_name, a.id_street, s.name AS street, a.number, id_unit, a.postal_code
  //                             FROM "Address" a
  //                             LEFT JOIN "County" c ON c.id = a.id_county
  //                             LEFT JOIN "Locality" l ON l.id = a.id_locality
  //                             LEFT JOIN "Village" v ON v.id = a.id_village
  //                             LEFT JOIN "Street" s ON s.id = a.id_street
  //                             WHERE a.id_unit = ${s.id_unit}`, { type: app.locals.db.QueryTypes.SELECT }).then(r => {
  //                               if(r.length) {
  //                                 s.address_unit = r[0];
  //                               }
  //                               cb1();
  //                             }).catch(e => cb1(e));
  //                           });
  //                         });
  //                         async.parallel(t, e => {
  //                           if(e) {
  //                             cb(e);
  //                           } else {
  //                             _.forEach(user[0].students, s => {
  //                               s.unit.address = s.address_unit;
  //                               delete s.address_unit;
  //                             });
  //                             cb();
  //                           }
  //                         });
  //                       }
  //                     }).catch(e => cb(e));
  //                   });
  //                 } else if(user[0].role === 'profesor') {
  //                   tasks.push(cb => {
  //                     app.locals.db.query(`SELECT p.id, p.first_name, p.last_name
  //                     FROM "Profesor" p
  //                     WHERE p.id_user = ${user[0].id}`, { type: app.locals.db.QueryTypes.SELECT }).then(resp => {
  //                       if(resp.length) {
  //                         user[0].id_profesor = resp[0].id;
  //                         user[0].first_name = resp[0].first_name;
  //                         user[0].last_name = resp[0].last_name;
  //                       }
  //                       cb();
  //                     }).catch(e => cb(e));
  //                   });
  //                 }

  //                 if(user[0].role !== 'parent') {
  //                   tasks.push(cb => {
  //                     app.locals.db.query(`SELECT u.id, u.name, u.cui, u.phone, u.email, u.fax, u.initialized, u.year, u.days_grade, u.days_absence, u.id_semester, ut.id AS id_unit_type, s.name AS name_semester, u.sms_token
  //                     FROM "Unit" u
  //                     LEFT JOIN "DraftUnitType" ut ON ut.id = u.id_draft_unit_type
  //                     LEFT JOIN "CfgSemester" s ON s.id = u.id_semester
  //                     WHERE u.id = ${user[0].id_unit}`, { type: app.locals.db.QueryTypes.SELECT }).then(resp => {
  //                       if(resp.length) {
  //                         resp[0].withSmsToken = !!resp[0].sms_token;
  //                         delete resp[0].sms_token;
  //                         unit = resp[0];
  //                       }
  //                       cb();
  //                     }).catch(e => cb(e));
  //                   });

  //                   tasks.push(cb => {
  //                     app.locals.db.query(`SELECT a.id_county, c.name AS county_name, a.id,a.id_village, v.name AS village_name, l.type_locality, l.type_village,
  //                     a.id_locality, l.name AS locality_name, a.id_street, s.name AS street, a.number, id_unit, a.postal_code
  //                     FROM "Address" a
  //                     LEFT JOIN "County" c ON c.id = a.id_county
  //                     LEFT JOIN "Locality" l ON l.id = a.id_locality
  //                     LEFT JOIN "Village" v ON v.id = a.id_village
  //                     LEFT JOIN "Street" s ON s.id = a.id_street
  //                     WHERE a.id_unit = ${user[0].id_unit}`, { type: app.locals.db.QueryTypes.SELECT }).then(resp => {
  //                       if(resp.length) {
  //                         address = resp[0];
  //                       }
  //                       cb();
  //                     }).catch(e => cb(e));
  //                   });
  //                 }

  //                 async.parallel(tasks, e => {
  //                   if (e) {
  //                     console.error('jwt: ', e);
  //                     res.json({success: false, message: 'Eroare la preluarea datelor!'});
  //                   } else {
  //                     user[0].unit = { ...unit, address };
  //                     render(res, user[0]);
  //                   }
  //                 });
  //               } else {
  //                 render(res, user[0]);
  //               }
  //             } else {
  //               res.json({success: false, message: 'Autentificare eșuată. Parolă greșită!'});
  //             }
  //           } else {
  //             res.json({success: false, message: 'Contul este dezactivat!'});
  //           }
  //         // } else {
  //         // 	res.json({success: false, message: 'Acest PC nu e autorizat!'});
  //         // }
  //       } else {
  //         res.json({success: false, message: 'Utilizator inexistent!'});
  //       }
  //     }).catch(e => {
  //       console.error('Autentificare eșuată', e);
  //       res.json({success: false, message: 'Autentificare eșuată!'});
  //     });
  //   } else {
  //     res.json({success: false, message: 'Adresa de email nu este validă!'});
  //   }
  // });

  router.post('/login', (req, res)=> {
    let d = new RegExp('"', 'g');
    let q = new RegExp('\'', 'g');
    let email = req.body.email.toLowerCase().replace(d, '').replace(q, '').replace(/\s/g, '');
    let email_regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    // app.locals.db.models.User.create({role: 'sa', email: 'costi.tuca@gmail.com', password: '123123'}).then(resp => {
    //   logAction(req.user.id, 'adminUserCtrl - create', `Creare utilizator - rol: ${resp.role}, id: ${resp.id}, nume: ${resp.first_name} ${resp.last_name}`);
    //   rhs(res);
    // }).catch(e => logError(req.user, 'adminUserCtrl - create (sa)', e, res, req));
    if (email_regex.test(email)) {
      req.body.email = req.body.email.replace(/\s/g, '').toLowerCase();
      app.locals.db.query(`SELECT id, first_name, last_name, email, role, active, password, salt, id_unit, current_month, uuid, gdpr, TO_CHAR(COALESCE(current_month, NOW()), 'yyyy')::INTEGER AS current_year, phone FROM "User" WHERE LOWER(TRIM(email)) = '${req.body.email}'`, {type: app.locals.db.QueryTypes.SELECT}).then(user => {
        if (user.length) {
          // if (req.body.uuid === user[0].uuid || user[0].role === 'sa') {
            if (user[0].active) {
              if (authenticate(req.body.password, user[0].salt, user[0].password)) {
                user[0].ip_address = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : req.socket.remoteAddress;
                app.locals.db.query(`SELECT ur.code, urj.selected
                FROM "UserRightsJunction" urj
                LEFT JOIN "CfgUserRights" ur ON ur.id = urj.id_cfg_user_rights
                WHERE urj.id_user = ${user[0].id}`, { type: app.locals.db.QueryTypes.SELECT }).then(r2 => {
                  user[0].rights = {};
                  for(let i = r2.length-1;i>=0; i--){
                    Object.assign(user[0].rights, {[r2[i].code]: r2[i].selected})
                  }
                  if (user[0].role !== 'admin' && user[0].role !== 'sa' && user[0].role !== 'secretary') {
                    const tasks = [];
                    let students = [], parents = [], profesors = [];
  
                    // --------------------------------------STUDENTS----------------------------------------
                    // --------------------------------------------------------------------------------------
                    tasks.push(cb => {
                      app.locals.db.query(`SELECT s.id, s.id_unit, s.id_class, s.first_name, s.last_name, c.id_class_organization, CONCAT(cn.number, ' ', c.letter) AS study_number
                      FROM "Student" s
                      LEFT JOIN "Class" c ON c.id = s.id_class
                      LEFT JOIN "ClassNumber" cn ON cn.id = c.id_class_number
                      WHERE s.id_user = ${user[0].id}`, { type: app.locals.db.QueryTypes.SELECT }).then(resp => {
                        if(resp.length) {
                          let t1 = [];
                          for(let ob of resp) {
                            t1.push(cb1 => {
                              app.locals.db.query(`SELECT u.id, u.name, u.cui, u.phone, u.email, u.fax, u.initialized, u.year, u.days_grade, u.days_absence, u.id_semester, ut.id AS id_unit_type, s.name AS name_semester, u.sms_token
                              FROM "Unit" u
                              LEFT JOIN "DraftUnitType" ut ON ut.id = u.id_draft_unit_type
                              LEFT JOIN "CfgSemester" s ON s.id = u.id_semester
                              WHERE u.id = ${ob.id_unit}`, { type: app.locals.db.QueryTypes.SELECT }).then(r => {
                                if(r.length) {
                                  r[0].withSmsToken = !!r[0].sms_token;
                                  delete r[0].sms_token;
                                  ob.unit = r[0];
                                }
                                cb1();
                              }).catch(e => cb1(e));
                            });
  
                            t1.push(cb1 => {
                              app.locals.db.query(`SELECT a.id_county, c.name AS county_name, a.id,a.id_village, v.name AS village_name, l.type_locality, l.type_village,
                              a.id_locality, l.name AS locality_name, a.id_street, s.name AS street, a.number, id_unit, a.postal_code
                              FROM "Address" a
                              LEFT JOIN "County" c ON c.id = a.id_county
                              LEFT JOIN "Locality" l ON l.id = a.id_locality
                              LEFT JOIN "Village" v ON v.id = a.id_village
                              LEFT JOIN "Street" s ON s.id = a.id_street
                              WHERE a.id_unit = ${ob.id_unit}`, { type: app.locals.db.QueryTypes.SELECT }).then(r => {
                                if(r.length) {
                                  ob.address_unit = r[0];
                                }
                                cb1();
                              }).catch(e => cb1(e));
                            });
                          }
                          async.parallel(t1, e => {
                            if(e) {
                              cb(e);
                            } else {
                              students = _.concat(students, resp);
                              cb();
                            }
                          });
                        } else {
                          cb();
                        }
                      }).catch(e => cb(e));
                    });
  
                    // ---------------------------------------PARENTS-----------------------------------------
                    // ---------------------------------------------------------------------------------------
                    tasks.push(cb => {
                      app.locals.db.query(`SELECT p.id, p.first_name, p.last_name
                      FROM "Parent" p
                      WHERE p.id_user = ${user[0].id}`, { type: app.locals.db.QueryTypes.SELECT }).then(respParents => {
                        const parentsIds = _.map(respParents, 'id');
  
                        if(parentsIds.length) {
                          app.locals.db.query(`SELECT s.id, s.id_unit, ps.id_parent, s.id_class, s.first_name, s.last_name, s.birthday_date AS birthday_date_order
                          , TO_CHAR(s.birthday_date, 'dd.MM.yyyy') AS birthday_date, CONCAT('Clasa a ', cn.number, '-a ', COALESCE(c.letter, '')) AS class, c.id_class_organization
                          FROM "ParentStudent" ps
                          LEFT JOIN "Student" s ON s.id = ps.id_student
                          LEFT JOIN "Class" c ON c.id = s.id_class
                          LEFT JOIN "ClassNumber" cn ON cn.id = c.id_class_number
                          WHERE ps.id_parent IN (${parentsIds})`, { type: app.locals.db.QueryTypes.SELECT }).then(studentsForParents => {
    
                            if(studentsForParents.length) {
                              let t1 = [];
                              for(let ob of studentsForParents) {
                                t1.push(cb1 => {
                                  app.locals.db.query(`SELECT u.id, u.name, u.cui, u.phone, u.email, u.fax, u.initialized, u.year, u.days_grade, u.days_absence, u.id_semester, ut.id AS id_unit_type, s.name AS name_semester, u.sms_token
                                  FROM "Unit" u
                                  LEFT JOIN "DraftUnitType" ut ON ut.id = u.id_draft_unit_type
                                  LEFT JOIN "CfgSemester" s ON s.id = u.id_semester
                                  WHERE u.id = ${ob.id_unit}`, { type: app.locals.db.QueryTypes.SELECT }).then(r => {
                                    if(r.length) {
                                      r[0].withSmsToken = !!r[0].sms_token;
                                      delete r[0].sms_token;
                                      ob.unit = r[0];
                                    }
                                    cb1();
                                  }).catch(e => cb1(e));
                                });
      
                                t1.push(cb1 => {
                                  app.locals.db.query(`SELECT a.id_county, c.name AS county_name, a.id,a.id_village, v.name AS village_name, l.type_locality, l.type_village,
                                  a.id_locality, l.name AS locality_name, a.id_street, s.name AS street, a.number, id_unit, a.postal_code
                                  FROM "Address" a
                                  LEFT JOIN "County" c ON c.id = a.id_county
                                  LEFT JOIN "Locality" l ON l.id = a.id_locality
                                  LEFT JOIN "Village" v ON v.id = a.id_village
                                  LEFT JOIN "Street" s ON s.id = a.id_street
                                  WHERE a.id_unit = ${ob.id_unit}`, { type: app.locals.db.QueryTypes.SELECT }).then(r => {
                                    if(r.length) {
                                      ob.address_unit = r[0];
                                    }
                                    cb1();
                                  }).catch(e => cb1(e));
                                });
                              }
                              async.parallel(t1, e => {
                                if(e) {
                                  cb(e);
                                } else {
                                  const groupedStudents = _.groupBy(studentsForParents, 'id_parent');
                                  for(let p of respParents) {
                                    if(groupedStudents[p.id]) {
                                      p.students = groupedStudents[p.id];
                                    }
                                  }
                                  parents = _.concat(parents, respParents);
                                  cb();
                                }
                              });
                            } else {
                              cb();
                            }
                          }).catch(e => cb(e));
                        } else {
                          cb();
                        }
                      }).catch(e => cb(e));
                    });
  
                    // --------------------------------------PROFESORS----------------------------------------
                    // ---------------------------------------------------------------------------------------
                    tasks.push(cb => {
                      app.locals.db.query(`SELECT p.id, p.id_unit, p.first_name, p.last_name
                      FROM "Profesor" p
                      WHERE p.id_user = ${user[0].id}`, { type: app.locals.db.QueryTypes.SELECT }).then(resp => {
                        if(resp.length) {
                          let t1 = [];
                          for(let ob of resp) {
                            t1.push(cb1 => {
                              app.locals.db.query(`SELECT u.id, u.name, u.cui, u.phone, u.email, u.fax, u.initialized, u.year, u.days_grade, u.days_absence, u.id_semester, ut.id AS id_unit_type, s.name AS name_semester, u.sms_token
                              FROM "Unit" u
                              LEFT JOIN "DraftUnitType" ut ON ut.id = u.id_draft_unit_type
                              LEFT JOIN "CfgSemester" s ON s.id = u.id_semester
                              WHERE u.id = ${ob.id_unit}`, { type: app.locals.db.QueryTypes.SELECT }).then(r => {
                                if(r.length) {
                                  r[0].withSmsToken = !!r[0].sms_token;
                                  delete r[0].sms_token;
                                  ob.unit = r[0];
                                }
                                cb1();
                              }).catch(e => cb1(e));
                            });
  
                            t1.push(cb1 => {
                              app.locals.db.query(`SELECT a.id_county, c.name AS county_name, a.id,a.id_village, v.name AS village_name, l.type_locality, l.type_village,
                              a.id_locality, l.name AS locality_name, a.id_street, s.name AS street, a.number, id_unit, a.postal_code
                              FROM "Address" a
                              LEFT JOIN "County" c ON c.id = a.id_county
                              LEFT JOIN "Locality" l ON l.id = a.id_locality
                              LEFT JOIN "Village" v ON v.id = a.id_village
                              LEFT JOIN "Street" s ON s.id = a.id_street
                              WHERE a.id_unit = ${ob.id_unit}`, { type: app.locals.db.QueryTypes.SELECT }).then(r => {
                                if(r.length) {
                                  ob.address_unit = r[0];
                                }
                                cb1();
                              }).catch(e => cb1(e));
                            });
                          }
                          async.parallel(t1, e => {
                            if(e) {
                              cb(e);
                            } else {
                              profesors = _.concat(profesors, resp);
                              cb();
                            }
                          });
                        } else {
                          cb();
                        }
                      }).catch(e => cb(e));
                    });
  
                    async.parallel(tasks, e => {
                      if (e) {
                        console.error('jwt: ', e);
                        res.json({success: false, message: 'Eroare la preluarea datelor!'});
                      } else {
                        if(user[0].role != 'secretary' && !students.length && !parents.length && !profesors.length) {
                          res.json({success: false, message: 'Autentificare eșuată. Niciun tip de utilizator nu este asociat cu acest cont!'});
                        } else {
                          if(user[0].role === 'secretary') {
                            unit.address = address;
                            user[0].unit = unit;
                          }
                          user[0].students = students;
                          user[0].parents = parents;
                          user[0].profesors = profesors;
                          user[0].ip_address = req.headers['x-forwarded-for'];
                          render(res, user[0], req);
                        }
                      }
                    });
                  } else {
                    let tasks = [], unit, address;
                    tasks.push(cb => {
                      app.locals.db.query(`SELECT u.id, u.name, u.cui, u.phone, u.email, u.fax, u.initialized, u.year, u.days_grade, u.days_absence, u.id_semester, ut.id AS id_unit_type, s.name AS name_semester, u.sms_token
                      FROM "Unit" u
                      LEFT JOIN "DraftUnitType" ut ON ut.id = u.id_draft_unit_type
                      LEFT JOIN "CfgSemester" s ON s.id = u.id_semester
                      WHERE u.id = ${user[0].id_unit}`, { type: app.locals.db.QueryTypes.SELECT }).then(resp => {
                        if(resp.length) {
                          resp[0].withSmsToken = !!resp[0].sms_token;
                          delete resp[0].sms_token;
                          unit = resp[0];
                        }
                        cb();
                      }).catch(e => cb(e));
                    });
  
                    tasks.push(cb => {
                      app.locals.db.query(`SELECT a.id_county, c.name AS county_name, a.id,a.id_village, v.name AS village_name, l.type_locality, l.type_village,
                      a.id_locality, l.name AS locality_name, a.id_street, s.name AS street, a.number, id_unit, a.postal_code
                      FROM "Address" a
                      LEFT JOIN "County" c ON c.id = a.id_county
                      LEFT JOIN "Locality" l ON l.id = a.id_locality
                      LEFT JOIN "Village" v ON v.id = a.id_village
                      LEFT JOIN "Street" s ON s.id = a.id_street
                      WHERE a.id_unit = ${user[0].id_unit}`, { type: app.locals.db.QueryTypes.SELECT }).then(resp => {
                        if(resp.length) {
                          address = resp[0];
                        }
                        cb();
                      }).catch(e => cb(e));
                    });
                    async.parallel(tasks, e => {
                      if (e) {
                        console.error('jwt: ', e);
                        res.json({success: false, message: 'Eroare la preluarea datelor!'});
                      } else {
                        if(user[0].role === 'secretary') {
                          if(unit) {
                            unit.address = address;
                            user[0].unit = unit;
                          }
                        }
                        render(res, user[0], req);
                      }
                    });
                  }
                })
              } else {
                res.json({success: false, message: 'Autentificare eșuată. Parolă greșită!'});
              }
            } else {
              res.json({success: false, message: 'Contul este dezactivat!'});
            }
          // } else {
          // 	res.json({success: false, message: 'Acest PC nu e autorizat!'});
          // }
        } else {
          res.json({success: false, message: 'Utilizator inexistent!'});
        }
      }).catch(e => {
        console.error('Autentificare eșuată', e);
        res.json({success: false, message: 'Autentificare eșuată!'});
      });
    } else {
      res.json({success: false, message: 'Adresa de email nu este validă!'});
    }
  });

  router.post('/userByToken', (req, res)=> {
      async.parallel({
        profesor: cb => {
          app.locals.db.query(`SELECT p.id, p.id_unit, CONCAT(p.last_name, ' ', p.first_name) AS name, p.email
          FROM "Profesor" p
          WHERE p.login_key = '${req.body.token}'`, {type: app.locals.db.QueryTypes.SELECT}).then(r => cb(null, r)).catch(e => cb(e));
        },
        student: cb => {
          app.locals.db.query(`SELECT s.id, s.id_unit, s.id_class, CONCAT(s.last_name, ' ', s.first_name) AS name, CONCAT('a-', cn.number, '-a ', COALESCE(c.letter, '')) AS class, s.email
          FROM "Student" s
          LEFT JOIN "Class" c ON c.id = s.id_class
          LEFT JOIN "ClassNumber" cn ON cn.id = c.id_class_number
          WHERE s.login_key = '${req.body.token}' AND s.deleted IS NOT TRUE`, {type: app.locals.db.QueryTypes.SELECT}).then(r => cb(null, r)).catch(e => cb(e));
        },
        parent: cb => {
          app.locals.db.query(`SELECT p.id, p.id_unit, CONCAT(p.last_name, ' ', p.first_name) AS name, p.email
          FROM "Parent" p
          WHERE p.login_key = '${req.body.token}'`, {type: app.locals.db.QueryTypes.SELECT}).then(r => cb(null, r)).catch(e => cb(e));
        }
      }, (e, r) => {
        if(e) {
          res.json({success: false, message: 'Verificare eșuată!'});
        } else {
          if(r.profesor.length) {
            r.profesor[0].type = 'profesor';
            r.profesor[0].profesor = true;
            res.json({success: true, message: '', person: r.profesor[0]});
          } else if(r.student.length) {
            r.student[0].type = 'elev';
            r.student[0].student = true;
            res.json({success: true, message: '', person: r.student[0]});
          } else if(r.parent.length) {
            r.parent[0].type = 'părinte';
            r.parent[0].parent = true;
            res.json({success: true, message: '', person: r.parent[0]});
          } else {
            res.json({success: false, message: 'Cheie de logare invalidă', person: {}});
          }
        }
      });
  });

  router.post('/checkUserByEmail', (req, res)=> {
    let email = req.body.email.replace(/\s/g, '').toLowerCase();
    app.locals.db.query(`SELECT id, first_name, last_name, role, active, password, salt, id_unit, current_month, uuid, gdpr
    FROM "User"
    WHERE LOWER(TRIM(email)) = '${email}'`, {type: app.locals.db.QueryTypes.SELECT}).then(r => {
      if(r.length) {
        res.send({user: r[0], found: true});
      } else {
        res.send({user: null, found: false});
      }
    })
  });

  router.post('/sendEmailResetPassword', (req, res)=> {
    let access_token = jwt.sign(req.body.user, app.locals.config.sKey, {expiresIn: 86400});
    emailSender.sendMailResetPassword(access_token, req.body.email);
    rhs(res);
  });

  router.post('/checkIdUserByResetToken', (req, res)=> {
    jwt.verify(req.body.token, app.locals.config.sKey, function checkToken(err, decoded) {
      if (err) {
        res.send({id_user: null, found: false});
      } else {
        res.send({id_user: decoded.id, found: true});
      }
    });
  });

  router.post('/resetPassword', (req, res) => {
    app.locals.db.query(`SELECT email, password, salt, active
      FROM "User"
      WHERE id = '${req.body.id_user}'`, {type: app.locals.db.QueryTypes.SELECT}).then(user => {
      if (user.length) {
        app.locals.db.query(`UPDATE "User" SET password = '${hashPwd(user[0].salt, req.body.password)}' WHERE id = ${req.body.id_user}`).then(() => {
          res.send({success: true, message: 'Parola a fost schimbată cu succes'});
        }).catch(e => console.log('e: ', e));
      } else {
        res.send({success: false, message: 'Utilizator inexistent'});
      }
    }).catch(e => {
      console.log(e);
      res.send({success: false, message: 'Eroare la schimbarea parolei'});
    });
  });

  router.get('/coutUserEmail/:id_user', (req, res) => {
    app.locals.db.query(`SELECT COUNT(id) AS count
    FROM "EmailData"
    WHERE id_user = ${req.params.id_user} AND read IS NOT TRUE AND archived IS NOT TRUE AND deleted IS NOT TRUE`, {type: app.locals.db.QueryTypes.SELECT}).then(r => {
      res.send({count: r.length ? r[0].count : 0});
    }).catch(e => res.send({error: e}));
  });

  router.get('/countSurvey/:id_user', (req, res) => {
    app.locals.db.query(`SELECT COUNT(id) AS count
    FROM "SurveyDistribution"
    WHERE id_user = ${req.params.id_user} AND completed IS NOT true`, {type: app.locals.db.QueryTypes.SELECT}).then(r => {
      res.send({count: r.length ? r[0].count : 0});
    }).catch(e => res.send({error: e}));
  });
  return router;
};
