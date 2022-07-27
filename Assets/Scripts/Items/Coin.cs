namespace Items {

    public class Coin : PickupItem {

        protected override void OnCarTriggerEnter (CarController otherCar) {
            SFX.PlaySound(SFX.Effect.CoinCollected);
            if(Level.current != null){
                Level.current.CoinCollected();
            }
            Destroy(this.gameObject);
        }

    }

}