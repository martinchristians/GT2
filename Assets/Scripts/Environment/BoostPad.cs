using UnityEngine;

public class BoostPad : MonoBehaviour {

    void OnTriggerEnter (Collider otherCollider) {
        if(otherCollider.TryGetComponent<CarController>(out var otherCar)){
            otherCar.Boost(transform.forward);
        }
    }

}
