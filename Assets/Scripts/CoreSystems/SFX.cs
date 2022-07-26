using UnityEngine;

public class SFX : MonoBehaviour {

    public enum Effect {
        CoinCollected
    }

    private static SFX instance;

    [SerializeField] AudioSource m_coinAudio;

    public static void EnsureExists () {
        if(ReferenceEquals(instance, null)){
            DontDestroyOnLoad(Instantiate(CoreSystems.GameConfig.instance.sfxPrefab));
        }
    }

    void Awake () {
        if(instance != null){
            Debug.LogError("Singleton violation!");
            Destroy(this);
            return;
        }
        instance = this;
        foreach(var audioSource in gameObject.GetComponentsInChildren<AudioSource>()){
            audioSource.playOnAwake = false;
            audioSource.Stop();
        }
    }

    void OnDestroy () {
        if(ReferenceEquals(this, instance)){
            instance = null;
        }
    }
    
    public static void PlaySound (Effect effectToPlay) {
        if(instance == null){
            Debug.LogError("No SFX instance!");
            return;
        }
        switch(effectToPlay){
            case Effect.CoinCollected:
                instance.m_coinAudio.Play();
                break;
            default:
                Debug.LogError($"Unknown effect \"{effectToPlay}\"!");
                break;
        }
    }

}
