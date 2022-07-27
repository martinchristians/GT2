using UnityEditor;

[CustomEditor(typeof(Level))]
public class LevelEditor : GenericEditor {

    protected override bool DrawPropertyCustom (SerializedProperty property) {
        switch(property.name){
            case "m_goldTime":
            case "m_silverTime":
            case "m_bronzeTime":
                return serializedObject.FindProperty("m_mode").intValue != (int)(Level.Mode.GoFastWithTimeLimits);
            case "m_initTimeLimit":
            case "m_goldDist":
            case "m_silverDist":
            case "m_bronzeDist":
                return serializedObject.FindProperty("m_mode").intValue != (int)(Level.Mode.GoFarWithCheckpoints);
            default:
                return false;
        }    
    }

}
