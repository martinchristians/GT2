using UnityEngine.SceneManagement;
using UnityEngine;

public class LoadNewScene: MonoBehaviour
{
    public void loadTutorial()
    {
        SceneManager.LoadScene("Tutorial");
    }

    public void loadAdvancedTutorial()
    {
        //TODO: load advancedTutorialScene
        Debug.Log("advancedTutorialScene does not yet exist");
    }

    public void loadFreeGame()
    {
        SceneManager.LoadScene("CarTest");
    }
}
