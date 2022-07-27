using UnityEngine;

namespace Environment {

    public abstract class Obstacle : MonoBehaviour {

        public virtual bool dealsDamage => true;
        
        public abstract void OnHit (CarController car);

    }

}