using UnityEngine.SceneManagement;
using UnityEngine;

public class LoadNewScene: MonoBehaviour
{
    public void loadTutorial()
    {
        //TODO: load TutorialScene
        Debug.Log("tutorialScene does not yet exist");
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
