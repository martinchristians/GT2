namespace Items {

    public class Coin : PickupItem {

        protected override void OnCarTriggerEnter (CarController otherCar) {
            SFX.PlaySound(SFX.Effect.CoinCollected);
            // TODO increase points in here
            UnityEngine.Debug.Log("TODO give points");
            Destroy(this.gameObject);
        }

    }

}