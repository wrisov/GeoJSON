const mongoose = require('mongoose');

const village_schema = new mongoose.Schema({
//         village_id : Number,
//         district_name : String,
//         village_name: String,
//         total_geographic_area: Number,
//         total_households: Number,
//         total_population_of_town : Number,
//         total_male_population_of_town: Number,
//         total_female_population_of_town: Number,
//         hospital_allopathic : Number,
//         hospital_allopathic_bed: Number,
//         hospital_allopathic_doctors_total_strength: Number,
//         hospital_allopathic_doctors_in_position : Number,
//         hospital_allopathic_para_medical_staff_total_strength: Number,
//         hospital_alternative_medicine: Number,
//         hospital_alternative_medicine_beds :Number,
//         hospital_alternative_medicine_doctors_total_strength: Number,
//         hospital_alternative_medicine_doctors_in_position : Number,
//         hospital_alternative_medicine_para_medical_staff_total_strength : Number,
//         hospital_alternative_medicine_nearest_facility : Number,
//         dispensary_health_centre : Number,
//         dispensary_health_centre_beds : Number,
//         dispensary_health_centre_doctors : Number,
//         dispensary_health_centre_doctors_in_position : Number,
//         dispensary_health_centre_para_medical_staff_in_position: Number,          
//         dispensary_health_centre_nearest_facility_distance : Number,
//         family_welfare_centre : Number,
//         family_welfare_centre_beds : Number,
//         family_welfare_centre_doctors_total_strength : Number,
//         family_welfare_centre_doctors_para_medical_staff_total_strength : Number,
//         family_welfare_centre_doctors_para_medical_staff_in_position : Number,
//         family_welfare_centre_nearest_facility : Number,
//         maternity_and_child_welfare_centre : Number,
//         maternity_and_child_welfare_centre_beds : Number,
//         maternity_and_child_welfare_centre_doctors_in_position : Number,
//         maternity_and_child_welfare_centre_para_medical_staff_total_strength : Number,
//         maternity_and_child_welfare_centre_para_medical_staff_in_position : Number,
//         maternity_and_child_welfare_centre_nearest_facility_centre : Number,
//         maternity_home : Number,
//         maternity_home_doctors_total_strength : Number,
//         maternity_home_doctors_in_position : Number,
//         maternity_home_para_medical_staff_total_strength : Number,
//         maternity_home_para_medical_staff_in_position : Number,
//         maternity_home_nearest_facility_distance : Number,
//         tb_hospital_clinic_beds: Number,
//         tb_hospital_clinic_doctors_total_strength : Number,
//         tb_hospital_clinic_doctors_in_position : Number,
//         tb_hospital_clinic_para_medical_staff_total_strength : Number,
//         tb_hospital_clinic_para_medical_staff_in_position : Number,
//         primary_health_centre: Number,
//         primary_health_centre_doctors_total_strength : Number,
//         primary_health_centre_doctors_in_position : Number,
//         primary_health_centre_para_medical_staff_in_position : Number,
//         primary_health_centre_para_medical_total_strength:Number,
//         primary_health_sub_centre : Number,
//         community_health_centre : Number,
//         community_health_centre_doctors_total_strength : Number,
//         community_health_centre_doctors_in_position : Number,
//         community_health_centre_para_medical_staff_total_strength : Number,
//         community_health_centre_para_medical_staff_in_position:Number,
//         veterinary_hospital : Number,
//         veterinary_hospital_beds : Number,
//         veterinary_hospital_doctors_total_strength : Number,
//         veterinary_hospital_doctors_in_position : Number,
//         veterinary_hospital_para_medical_staff_in_position : Number,
//         veterinary_hospital_nearest_facility_distance : Number,
//         mobile_health_clinic : Number,
//         mobile_health_clinic_beds : Number,
//         mobile_health_clinic_doctors_total_strength : Number,
//         mobile_health_clinic_para_medical_staff_total_strength : Number,
//         mobile_health_clinic_para_medical_staff_in_position : Number,
//         mobile_health_clinic_nearest_facility_distance : Number,
//         others : Number,
//         others_beds: Number,
//         others_doctors_total_strength : Number,
//         others_doctors_in_position : Number,
//         others_para_medical_staff_total_strength : Number,
//         others_para_medical_staff_in_position : Number,
//         others_nearest_facility_distance : Number,
//         non_government_in_and_out_patient : Number,
//         non_government_medicine_shop : Number,
// 



village_name : String,
district_name: String,
state_name: String,
latitude:Number,
longitude:Number,
dt_code:Number,
st_code:Number,
'Total Geographical Area (in Hectares)':Number,
'Total Households':Number,
'Total Population of Village':Number,
'Total Male Population of Village':Number,
'Total Female Population of Village':Number,
'Community Health Centre (Numbers)':Number,
'Community Health Centre Doctors Total Strength (Numbers)': Number,  
'Community Health Centre Doctors In Position (Numbers)':Number, 
'Community Health Centre Para Medical Staff Total Strength (Numbers)':Number,
'Community Health Centre Para Medical Staff In Position (Numbers)':Number,
'Primary Health Centre (Numbers)':Number,
'Primary Health Centre Doctors Total Strength (Numbers)':Number,
'Primary Health Centre Doctors In Position (Numbers)':Number,
'Primary Health Centre Para Medical Staff Total Strength (Numbers)':Number,
'Primary Health Centre Para Medical Staff In Position (Numbers)':Number,
'Primary Heallth Sub Centre (Numbers)':Number,
'Primary Heallth Sub Centre Doctors Total Strength (Numbers)':Number,
'Primary Heallth Sub Centre Doctors In Position (Numbers)':Number,
'Primary Heallth Sub Centre Para Medical Staff Total Strength (Numbers)':Number,
'Primary Heallth Sub Centre Para Medical Staff In Position (Numbers)':Number,
'Maternity And Child Welfare Centre (Numbers)':Number,
'Maternity And Child Welfare Centre Doctors Total Strength (Numbers)':Number,
'Maternity And Child Welfare Centre Doctors In Position (Numbers)':Number,
'Maternity And Child Welfare Centre Para Medical Staff Total Strength (Numbers)':Number,
'Maternity And Child Welfare Centre Para Medical Staff In Position (Numbers)':Number,
'TB Clinic (Numbers)':Number, 
'TB Clinic Doctors Total Strength (Numbers)':Number, 
'TB Clinic Doctors In Position (Numbers)':Number, 
'TB Clinic Para Medical Para Medical Staff Total Strength (Numbers)':Number, 
'TB Clinic Para Medical Para Medical Staff In Position (Numbers)':Number, 
'Hospital Allopathic (Numbers)':Number, 
'Hospital Allopathic Doctors Total Strength (Numbers)':Number, 
'Hospital Allopathic Doctors In Position (Numbers)':Number, 
'Hospital Allopathic Para Medical Staff Total Strength (Numbers)':Number, 
'Hospital Allopathic Para Medical Staff In Position (Numbers)':Number, 
'Hospital Alternative Medicine (Numbers)':Number, 
'Hospital Alternative Medicine Doctors Total Strength (Numbers)':Number, 
'Hospital Alternative Medicine Doctors In Position (Numbers)':Number, 
'Hospital Alternative Medicine Para Medical Staff Total Strength (Numbers)':Number, 
'Hospital Alternative Medicine Para Medical Staff In Position (Numbers)': Number, 
'Dispensary (Numbers)':Number, 
'Dispensary Doctors Total Strength (Numbers)':Number, 
'Dispensary Doctors In Position (Numbers)':Number, 
'Dispensary Para Medical Staff Total Strength (Numbers)':Number, 
'Dispensary Para Medical Staff In Position (Numbers)':Number, 
'Veterinary Hospital (Numbers)':Number, 
'Veterinary Hospital Doctors Total Strength (Numbers)':Number, 
'Veterinary Hospital Doctors In Position (Numbers)':Number, 
'Veterinary Hospital Para Medical Staff Total Strength (Numbers)':Number, 
'Veterinary Hospital Para Medical Staff In Position (Numbers)':Number, 
'Mobile Health Clinic (Numbers)':Number, 
'Mobile Health Clinic Doctors Total Strength (Numbers)':Number, 
'Mobile Health Clinic Doctors In Position (Numbers)':Number, 
'Mobile Health Clinic Para Medical Staff Total Strength (Numbers)':Number, 
'Mobile Health Clinic Para Medical Staff In Position(Numbers)':Number, 
'Family Welfare Centre (Numbers)':Number, 
'Family Welfare Centre Doctors Total Strength (Numbers)':Number, 
'Family Welfare Centre Doctors In Position (Numbers)':Number, 
'Family Welfare Centre Para Medical Staff Total Strength (Numbers)':Number, 
'Family Welfare Centre Para Medical Staff In Position (Numbers)':Number, 
'Non Government Medical facilities Out Patient (Numbers)':Number, 
'Non Government Medical facilities In And Out Patient (Numbers)':Number, 
'Non Government Medical facilities Charitable (Numbers)':Number, 
'Non Government Medical facilities Medical Prctitioner with MBBS Degree (Numbers)':Number, 
'Non Government Medical facilities Medical Prctitioner with other Degree (Numbers)':Number, 
'Non Government Medical facilities Medical Practitioner with no Degree (Numbers)':Number, 
'Non Government Medical facilities Traditional Practitioner and Faith Healer (Numbers)':Number, 
'Non Government Medical facilities Medicine Shop (Numbers)':Number, 
'Non Government Medical facilities Others (Numbers)':Number, 
'Nutritional Centres-ICDS (Status A(1)/NA(2))':Number,                                                      
'Nutritional Centres-Anganwadi Centre (Status A(1)/NA(2))':Number, 
'Nutritional Centres-Others (Status A(1)/NA(2))':Number, 
'ASHA (Status A(1)/NA(2))':Number, 
})
module.exports = mongoose.model('Village',_schema);