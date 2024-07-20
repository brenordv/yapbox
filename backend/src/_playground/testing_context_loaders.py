from src.ai_utils.ai_context_loader import ContextBuilder


def main():
    context_builder = ContextBuilder()
    

    shadowheart = context_builder.load_personality("Shadowheart")
    print(shadowheart)

    print("---------------------")

    luna_basic = context_builder.load_personality("Luna")
    print(luna_basic)

    print("---------------------")

    luna_angry = context_builder.load_personality("Luna", "angry")
    print(luna_angry)

    print("---------------------")

    luna_horny = context_builder.load_personality("Luna", "horny")
    print(luna_horny)

    print("---------------------")

    luna_jaded = context_builder.load_personality("Luna", "jaded", ruleset="chat")
    print(luna_jaded)


if __name__ == '__main__':
    main()
