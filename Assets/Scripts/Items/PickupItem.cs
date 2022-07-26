using UnityEngine;

namespace Items {

    public abstract class PickupItem : MonoBehaviour {

        Transform m_model;
        bool m_moveModel;
        float m_modelMoveT;
        Vector3 m_initModelPos;

        void Awake () {
            if(!TryGetComponent<Collider>(out var col)){
                Debug.LogWarning($"{nameof(PickupItem)} of type {this.GetType().FullName} doesn't have a collider on it!", this.gameObject);
            }else{
                if(!col.isTrigger){
                    Debug.LogWarning($"The collider on {nameof(PickupItem)} of type {this.GetType().FullName} isn't set as a trigger, fixing!", this.gameObject);
                    col.isTrigger = true;
                }
            }
            if(transform.childCount != 1){
                Debug.LogWarning($"{nameof(PickupItem)} of type {this.GetType().FullName} should have a single child that is the viewmodel, setting whole object as model instead!", this.gameObject);
                m_model = this.transform;
                m_moveModel = false;
            }else{
                m_model = this.transform.GetChild(0);
                m_modelMoveT = Random.value;
                m_initModelPos = m_model.localPosition;
                m_moveModel = true;
            }
            m_model.Rotate(Vector3.up * 360 * Random.value, Space.World);
        }

        void Update () {
            m_model.Rotate(Vector3.up * 60 * Time.deltaTime, Space.World);
            if(m_moveModel){
                m_modelMoveT += Time.deltaTime;
                m_model.localPosition = m_initModelPos + new Vector3(0, Mathf.Sin(m_modelMoveT * 2f * Mathf.PI) * 0.1f, 0);
            }
        }
        
        void OnTriggerEnter (Collider otherCollider) {
            if(otherCollider.TryGetComponent<CarController>(out var otherCar)){
                OnCarTriggerEnter(otherCar);
            }
        }

        protected abstract void OnCarTriggerEnter (CarController otherCar);

    }

}