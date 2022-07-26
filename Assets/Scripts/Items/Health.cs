namespace Items {

    public class Health : PickupItem {
        
        protected override void OnCarTriggerEnter (CarController otherCar) {
            if(otherCar.TryHeal()){
                Destroy(this.gameObject);
            }   
        }

    }

}