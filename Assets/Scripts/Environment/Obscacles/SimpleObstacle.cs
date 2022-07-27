using UnityEngine;

namespace Environment {

    public class SimpleObstacle : Obstacle {
        
        [SerializeField] bool m_dealsDamage;

        public override void OnHit (CarController car) {
            // nothing :)
        }

    }

}