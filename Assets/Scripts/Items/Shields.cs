namespace Items {

    public class Shields : PickupItem {
        
        protected override void OnCarTriggerEnter (CarController otherCar) {
            if(otherCar.TryGainShields()){
                Destroy(this.gameObject);
            }
        }

    }

}