using System.Collections;
using System.Collections.Generic;

using UnityEngine;

namespace KenCars {

    public class VehicleCamera : MonoBehaviour{
        
        // Camera controller for vehicle
                
        [Header("Components")]
        
        public Transform rig;
        
        [Header("Settings")]
                
        [Range(1, 20)] public float followSpeed	= 16;
        [Range(1, 20)] public float rotationSpeed = 12;
        
        public bool followPosition = true;
        public bool followRotation = true;
        
        // Private
        
        Vector3 cameraPositionOffset;
        Vector3 cameraRotationOffset;
                
        // Functions
        
        void Awake(){
            
            // Remember offset set in editor
            
            cameraPositionOffset = rig.localPosition;
            cameraRotationOffset = rig.localEulerAngles;
            
            // Set camera
            
            UpdateCamera();
            
        }
        
        void UpdateCamera(){
            
            // Set camera viewport based on selected option
            
        }
        
        void FixedUpdate(){
            
            // Camera follow
            
            if(followPosition){
                rig.position = Vector3.Lerp(rig.position, transform.position + cameraPositionOffset, Time.deltaTime * followSpeed);
            }
            if(followRotation){
                rig.rotation = Quaternion.Lerp(rig.rotation, Quaternion.Euler(transform.eulerAngles + cameraRotationOffset), Time.deltaTime * rotationSpeed);
            }
            
        }
        
    }

}