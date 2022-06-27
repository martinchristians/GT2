using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using Communication;

public class LevelLoader : MonoBehaviour {

    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
    static void CreateInstance () {
        DontDestroyOnLoad(new GameObject("[Level Loader]", typeof(LevelLoader)));
    }

    bool loading = false;
    int nextScene = -1;

    void Awake () {
        GameClient.onLevelStartRequested += (lvl) => nextScene = lvl;   // TODO should be a good enough solution, since levels start at 1
        GameClient.onMainMenuRequested += () => nextScene = 0;          // TODO should be a good enough solution as the main menu needs to be 0 anyways
    }

    void Update () {
        if(nextScene >= 0){
            StartCoroutine(LoadScene(nextScene));
            nextScene = -1;
        }
    }

    IEnumerator LoadScene (int sceneIndex) {
        if(loading){
            Debug.LogError($"Already loading, aborting call to load scene \"{sceneIndex}\"!");
            yield break;
        }
        loading = true;
        yield return SceneManager.LoadSceneAsync(sceneIndex);
        if(sceneIndex > 0){
            GameClient.ResetButtonsPressed();
            GameClient.SendLevelStarted();
        }else{
            GameClient.SendMainMenuOpened();
        }
        loading = false;
    }

}
