namespace Items {

    public class Shields : PickupItem {
        
        protected override void OnCarTriggerEnter (CarController otherCar) {
            if(otherCar.TryGetShields()){
                Destroy(this.gameObject);
            }
        }

    }

}