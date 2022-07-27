using UnityEngine;

[SelectionBase]
public class CheckPoint : MonoBehaviour {
    
    void OnTriggerEnter (Collider otherCollider) {
        if(otherCollider.TryGetComponent<CarController>(out _)){
            if(Level.current != null){
                Level.current.CheckpointPassed();
                Destroy(this.gameObject);
            }
        }
    }

}
