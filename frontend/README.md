# YapBox - Frontend
This is a simple web interface to interact with the YapBox API.
You'll have the same functionalities as the backend CLI, but with a nice UI.

> Important note: There's a lot of room for improvement here. I did this in a rush, and (maybe) I'll come back to it 
> later to clean things up.

To define which type of AI integration you want to use, run the appropriate start command (see below).

Note: Before using anything, you'll need to run the backend API.
```shell
cd ..\backend
python api.py
```

To use "pure" AI:
```bash
npm run start
```

To use the data analyst agent:
```bash
npm run start:da
```

To talk to aa video game character:
```bash
npm run start:astarion
npm run start:aylin
npm run start:gale
npm run start:halsin
npm run start:isobel
npm run start:jaheira
npm run start:karlac
npm run start:laezel
npm run start:minsc
npm run start:minthara
npm run start:shadowheart
npm run start:wyll
npm run start:cait
npm run start:cogsworth
npm run start:curie
npm run start:mama-murphy
npm run start:nick-valentine
npm run start:paladin-danse
npm run start:preston-garvey
npm run start:serana
``` 

# Attributions
For the frontend, I'm using DiceBear to generate the avatars. You can find more information about it [here](https://avatars.dicebear.com/).