using UnityEngine;

public class CollectCoin : MonoBehaviour {

    void Awake () {
        gameObject.tag = "Coin";
    }

    public void Collect () {
        SFX.PlaySound(SFX.Effect.CoinCollected);
        // TODO increase points in here
        Destroy(this.gameObject);
    }
}
